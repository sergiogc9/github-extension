import React from 'react';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import HashLoader from "react-spinners/HashLoader";

import { getRepositoryUrl, getPullRequestUrl, getUserUrl } from 'lib/Github/GithubUrl';
import { SymbolicIcon } from 'components/common/Icon/Icon';
import GithubLabel from 'components/common/ui/GithubLabel/GithubLabel';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import { PageHandlerContext } from 'components/Extension/Context/PageContext';
import { GithubPullRequest } from 'types/Github';

import './ExtensionPopupPullRequests.scss';

type ComponentProps = {}

const ExtensionPopupPullRequests: React.FC<ComponentProps> = props => {
	const [pullRequests, setPullRequests] = React.useState<GithubPullRequest[]>([]);
	const [loadingPullRequests, setLoadingPullRequests] = React.useState<boolean>(false);

	const messageHandlers = React.useContext(MessageHandlersContext)!;
	const pageHandlers = React.useContext(PageHandlerContext)!;

	React.useEffect(() => {
		messageHandlers.sendBackgroundMessage({ type: 'get_pull_requests' });

		messageHandlers.onBackgroundMessage(message => {
			if (message.type === 'pull_requests_loading') setLoadingPullRequests(true);
			if (message.type === 'pull_requests_updated') {
				setPullRequests(orderBy(message.data, 'updated_at', 'desc'));
				setLoadingPullRequests(false);
			}
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const loaderContent = React.useMemo(() => {
		if (!loadingPullRequests) return null;
		return (
			<div className='pull-request-loader'>
				<HashLoader size={20} color='#1E90FF' />
			</div>
		);
	}, [loadingPullRequests]);

	const content = React.useMemo(() => pullRequests.map(pr => {
		const repoUrl = getRepositoryUrl(pr.owner, pr.repository);
		const prUrl = getPullRequestUrl(pr.owner, pr.repository, pr.number);
		const userUrl = getUserUrl(pr.user.username);
		return (
			<div className='pull-request' key={pr.repository + pr.number}>
				<SymbolicIcon name='pull-request' type='duo' color='green' />
				<div className='pr-content'>
					<a href={repoUrl} onClick={() => pageHandlers.openNewTab(repoUrl)}>{pr.owner}/{pr.repository}</a>
					<div className='title-content'>
						<a href={prUrl} onClick={() => pageHandlers.openNewTab(prUrl)}>{pr.title}</a>
						{pr.labels.map(label => <GithubLabel key={label.id} color={`#${label.color}`} text={label.name} />)}
					</div>
					<div className='pr-content-info'>
						#{pr.number} opened by <a href={userUrl} onClick={() => pageHandlers.openNewTab(userUrl)}>{pr.user.username}</a> - Updated {moment(pr.updated_at).fromNow()}
					</div>
				</div>
			</div>
		);
	}), [pullRequests, pageHandlers]);

	return (
		<div id="githubExtensionPopupPullRequests">
			{loaderContent}
			{content}
		</div>
	);
};

export default React.memo(ExtensionPopupPullRequests);
