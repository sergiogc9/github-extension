import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import size from 'lodash/size';
import mapValues from 'lodash/mapValues';
import forEach from 'lodash/forEach';
import some from 'lodash/some';
import cloneDeep from 'lodash/cloneDeep';

type RepositoryTree<T, U> = {
	folders: Record<string, RepositoryFolder<T, U>>;
	files: Record<string, RepositoryFile<U>>;
};

type RepositoryFolder<T, U> = {
	folders: Record<string, RepositoryFolder<T, U>>;
	files: Record<string, RepositoryFile<U>>;
	name: string;
	path: string;
	visible: boolean; // A folder is visible if any folder or file in its subtree is visible
	matchesSearch: boolean;
} & T;

type RepositoryFile<U> = {
	matchesSearch: boolean;
	name: string;
	path: string; // Full path without file
	sha: string;
	visible: boolean;
} & U;

type PRFolderAttributes = Record<string, unknown>;
type PRFileAttributes = {
	previousName?: string;
	status: 'added' | 'removed' | 'renamed' | 'modified';
};

export type PullRequestFolder = RepositoryFolder<PRFolderAttributes, PRFileAttributes>;
export type PullRequestFile = RepositoryFile<PRFileAttributes>;
export type PullRequestTree = RepositoryTree<PRFolderAttributes, PRFileAttributes>;

type CodeTreeFolderAttributes = {
	sha: string;
	loaded: boolean;
};
type CodeTreeFileAttributes = Record<string, unknown>;
export type CodeTreeFolder = RepositoryFolder<CodeTreeFolderAttributes, CodeTreeFileAttributes>;
export type CodeTreeFile = RepositoryFile<CodeTreeFileAttributes>;
export type CodeTree = RepositoryTree<CodeTreeFolderAttributes, CodeTreeFileAttributes>;

export class GithubTree<T = PullRequestTree | CodeTree> {
	private __tree: RepositoryTree<unknown, unknown> = { folders: {}, files: {} };

	private __getFolder = (path: string) => {
		const folderNames = path ? path.split('/') : [];
		let folder = this.__tree;
		// Create folder directory tree
		while (!isEmpty(folderNames) && !isEmpty(folderNames[0])) {
			const folderName = folderNames.shift()!;
			folder = folder.folders[folderName];
		}
		return folder;
	};

	private __addFolder = (path: string, data: any) => {
		const folderNames = path ? path.split('/') : [];
		let folder = this.__tree;
		let whilePath = '';
		// Create folder directory tree
		while (!isEmpty(folderNames) && !isEmpty(folderNames[0])) {
			const folderName = folderNames.shift()!;
			whilePath = whilePath ? `${whilePath}/${folderName}` : folderName;
			const defaultFolderData = {
				folders: {},
				files: {},
				name: folderName,
				path: whilePath,
				visible: true,
				matchesSearch: false
			};
			folder.folders[folderName] = folder.folders[folderName] || {
				...defaultFolderData,
				...data
			};
			folder = folder.folders[folderName];
		}
		return folder;
	};

	private __addFile = (path: string, fileName: string, data: any) => {
		const folder = this.__addFolder(path, {});
		// Add file to folder
		folder.files[fileName] = data;
	};

	private __addApiTree = (apiData: any, recursive: boolean) => {
		if (apiData.truncated)
			// eslint-disable-next-line no-alert
			alert(
				'Github extension: Repository tree is too big, some directories or files have not been loaded. Please enable lazy loading in settings.'
			);
		// eslint-disable-next-line no-restricted-syntax
		for (const treeItem of apiData.tree) {
			// Case folder
			if (treeItem.type === 'tree') {
				const folderData: Partial<CodeTreeFolder> = {
					sha: treeItem.sha,
					loaded: recursive
				};
				this.__addFolder(treeItem.path, folderData);
			}
			// Case file
			else if (treeItem.type === 'blob') {
				// eslint-disable-next-line no-useless-escape
				const [, folderPath, fileName] = treeItem.path.match(/^(.*\/{1})*([^\/].*)$/);
				const fileData: CodeTreeFile = {
					name: fileName,
					path: folderPath || '',
					sha: treeItem.sha,
					visible: true,
					matchesSearch: false
				};
				this.__addFile(folderPath, fileName, fileData);
			}
		}
	};

	private __recursiveJoinFolder = (folder: RepositoryFolder<any, any>, prev: string): RepositoryFolder<any, any> => {
		const path = prev ? `${prev}/${folder.name}` : folder.name;
		if (size(folder.folders) === 1 && size(folder.files) === 0) {
			const uniqueSubFolder = folder.folders[keys(folder.folders)[0]];
			return this.__recursiveJoinFolder(uniqueSubFolder, path);
		}
		return {
			...folder,
			name: path,
			folders: mapValues(folder.folders, f => this.__recursiveJoinFolder(f, ''))
		};
	};

	private __recursiveFilter = (folder: RepositoryFolder<any, any>, text: string): RepositoryFolder<any, any> => {
		forEach(folder.folders, f => this.__recursiveFilter(f, text));
		forEach(folder.files, file => {
			file.matchesSearch = !isEmpty(text) && file.name.toLowerCase().includes(text.toLowerCase());
			file.visible = isEmpty(text) || file.matchesSearch;
		});
		// Check not root case
		if (folder.name) {
			folder.matchesSearch = !isEmpty(text) && folder.name.toLowerCase().includes(text.toLowerCase());
			folder.visible =
				isEmpty(text) ||
				folder.matchesSearch ||
				some(folder.folders, f => f.visible) ||
				some(folder.files, f => f.visible);
		}
	};

	// Data is the response of pull request files call
	public initFromPullRequestFiles = (apiData: any) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const apiFileData of apiData) {
			// eslint-disable-next-line no-useless-escape
			const [, folderPath, fileName] = apiFileData.filename.match(/^(.*\/{1})*([^\/].*)$/);
			const fileData: PullRequestFile = {
				matchesSearch: false,
				name: fileName,
				path: folderPath || '',
				previousName: apiFileData.previous_filename,
				sha: apiFileData.sha,
				status: apiFileData.status,
				visible: true
			};
			this.__addFile(folderPath, fileName, fileData);
		}
	};

	// Data is the response of get tree call. In this case a branch tree
	public initFromCodeTree = (apiData: any, recursive: boolean) => {
		this.__addApiTree(apiData, recursive);
	};

	public loadFolder = (folderApiData: any, folderPath: string) => {
		folderApiData.tree = folderApiData.tree.map((item: any) => ({
			...item,
			path: folderPath + item.path
		}));
		(this.__getFolder(folderPath) as CodeTreeFolder).loaded = true;
		this.__addApiTree(folderApiData, false);
	};

	public joinEmptyDirectories = () => {
		this.__tree.folders = mapValues(this.__tree.folders, folder => this.__recursiveJoinFolder(folder, ''));
	};

	public filter = (text: string) => {
		this.__recursiveFilter(this.__tree, text);
	};

	public getTree = (): T => {
		return cloneDeep(this.__tree) as any;
	}; // Clone tree to force folder and file components to render
}
