import React from 'react';
import { useAsync } from 'react-async';
import isEmpty from 'lodash/isEmpty';
import numeral from 'numeral';

import GithubApi from 'lib/Github/GithubApi';
import { PageContext } from 'components/Extension/Context/PageContext';
import { AlertContext } from 'components/Extension/Context/AlertContext';
import { MessageHandlersContext } from 'components/Extension/Context/MessageContext';
import {
	HeaderBranchPlaceholder,
	PullRequestInfoPlaceholder,
	PullRequestReviewsPlaceholder,
	PullRequestActionsPlaceholder
} from 'components/common/Placeholder';
import { FontAwesomeIcon, SymbolicIcon } from 'components/common/Icon/Icon';
import GithubLabel from 'components/common/ui/GithubLabel/GithubLabel';

import PullRequestTree from './Tree/PullRequestTree';
import PullRequestChecks from './Checks/PullRequestChecks';
import PullRequestActions from './Actions/PullRequestActions';
import PullRequestReviewers from './Reviewers/PullRequestReviewers';

import './PullRequest.scss';

const PullRequest: React.FC = () => {
	const pageData = React.useContext(PageContext)!;
	const alertHandlers = React.useContext(AlertContext)!;
	const messageHandlers = React.useContext(MessageHandlersContext)!;

	const { data: pullRequest, isLoading } = useAsync({
		promiseFn: GithubApi.getPullRequestInfo,
		data: pageData.data,
		onReject: alertHandlers.onGithubApiError
	});

	React.useEffect(() => {
		if (pullRequest)
			messageHandlers.sendBackgroundMessage({
				type: 'pull_request_seen',
				data: pullRequest
			});
	}, [pullRequest]); // eslint-disable-line react-hooks/exhaustive-deps

	const branchContent = React.useMemo(() => {
		if (isLoading) return <HeaderBranchPlaceholder />;
		if (!pullRequest) return null;

		return (
			<>
				<span>{pullRequest.branches!.base}</span>
				<FontAwesomeIcon name="caret-up" type="solid" />
				<span>{pullRequest.branches!.head}</span>
			</>
		);
	}, [pullRequest, isLoading]);

	const headerContent = React.useMemo(() => {
		const { user, repository } = pageData.data;
		return (
			<div id="githubExtensionPullRequestHeader" className="github-extension-header">
				<div id="githubExtensionPullRequestHeaderTitle" className="github-extension-header-info-title">
					<SymbolicIcon name="pull-request" type="duo" />
					<a href={`https://github.com/${user}`} target="_blank" rel="noreferrer">
						{user}
					</a>
					<FontAwesomeIcon name="chevron-double-right" type="solid" />
					<a href={`https://github.com/${user}/${repository}`} target="_blank" className="bold" rel="noreferrer">
						{repository}
					</a>
				</div>
				<div id="githubExtensionPullRequestHeaderBranch" className="github-extension-header-branch">
					{branchContent}
				</div>
			</div>
		);
	}, [pageData.data, branchContent]);

	const infoContent = React.useMemo(() => {
		const content =
			pullRequest && !isLoading ? (
				<>
					<div title="Commits">
						<FontAwesomeIcon name="code-commit" type="duo" />
						<span>{pullRequest.commits}</span>
					</div>
					<div title="Files">
						<FontAwesomeIcon name="copy" type="duo" />
						<span>{pullRequest.changedFiles}</span>
					</div>
					<div title="Comments">
						<SymbolicIcon name="chat-conversation-alt" type="solid" />
						<span>{pullRequest.comments + pullRequest.reviewComments}</span>
					</div>
					<div title="Lines added" className="info-additions">
						<FontAwesomeIcon name="square" type="solid" />
						<span className="text-small">+</span>
						<span>{numeral(pullRequest.additions).format('0a')}</span>
					</div>
					<div title="Lines deleted" className="info-deletions">
						<FontAwesomeIcon name="square" type="solid" />
						<span className="text-small">-</span>
						<span>{numeral(pullRequest.deletions).format('0a')}</span>
					</div>
				</>
			) : (
				<PullRequestInfoPlaceholder />
			);

		return <div className="github-extension-pull-request-info">{content}</div>;
	}, [pullRequest, isLoading]);

	const labelsContent = React.useMemo(() => {
		if (!pullRequest || isLoading || isEmpty(pullRequest.labels)) return null;
		return (
			<div className="github-extension-pull-request-labels">
				{pullRequest.labels.map(label => (
					<GithubLabel key={label.id} color={`#${label.color}`} text={label.name} />
				))}
			</div>
		);
	}, [pullRequest, isLoading]);

	const reviewsContent = React.useMemo(() => {
		const reviewsPlaceholder = (!pullRequest || isLoading) && <PullRequestReviewsPlaceholder />;
		const reviewersContent = !isLoading && pullRequest && pullRequest.reviews && (
			<PullRequestReviewers reviews={pullRequest.reviews} />
		);
		const checksContent = !isLoading && pullRequest && <PullRequestChecks pullRequest={pullRequest} />;

		return (
			<div className="github-extension-pull-request-reviews">
				{reviewsPlaceholder}
				{reviewersContent}
				{checksContent}
			</div>
		);
	}, [pullRequest, isLoading]);

	const actionsContent = React.useMemo(() => {
		const content =
			!isLoading && pullRequest ? <PullRequestActions pullRequest={pullRequest} /> : <PullRequestActionsPlaceholder />;

		return <div className="github-extension-pull-request-actions">{content}</div>;
	}, [pullRequest, isLoading]);

	return (
		<div id="githubExtensionPullRequest">
			{headerContent}
			{infoContent}
			{labelsContent}
			<PullRequestTree />
			{reviewsContent}
			{actionsContent}
		</div>
	);
};

export default React.memo(PullRequest);
