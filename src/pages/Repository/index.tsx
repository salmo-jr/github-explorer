import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import api from '../../services/api';

import logo from '../../assets/logo.svg';
import * as SC from './styles';

interface RepositoryParams {
    repository: string;
}

interface IRepository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
      login: string;
      avatar_url: string;
    };
}

interface Issue {
    id: string;
    title: string;
    html_url: string;
    user: {
        login: string;
    };
}

const Repository: React.FC = () => {
    const [repository, setRepository] = useState<IRepository | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const { params } = useRouteMatch<RepositoryParams>();

    useEffect(() => {
        /* api.get(`repos/${params.repository}`).then((response) => {
            console.log(response.data);
        });
        api.get(`repos/${params.repository}/issues`).then((response) => {
            console.log(response.data);
        }); */

        // executar as requisicoes juntas - elas sao independentes
        async function loadData(): Promise<void>{
            const [repository, issues] = await Promise.all([
                api.get(`repos/${params.repository}`),
                api.get(`repos/${params.repository}/issues`)
            ]);
            setRepository(repository.data);
            setIssues(issues.data);
        }

        loadData();
    }, [params.repository]);

    return(
        <>
            <SC.Header>
                <img src={logo} alt="Github Explorer" />
                <Link to="/">
                    <FiChevronLeft size={16}/>
                    voltar
                </Link>
            </SC.Header>
            {repository && (
                <SC.RepositoryInfo>
                    <header>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <p>Stars</p>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <p>Forks</p>
                        </li>
                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <p>Issues abertas</p>
                        </li>
                    </ul>
                </SC.RepositoryInfo>
            )}
            <SC.Issues>
                {issues.map(issue => {
                    return (
                        <a key={issue.id} href={issue.html_url} target="_blank" rel="noreferrer">
                            <div>
                                <strong>{issue.title}</strong>
                                <p>{issue.user.login}</p>
                            </div>
                            <FiChevronRight size={20} />
                        </a>
                    );
                })}
            </SC.Issues>
        </>
    );
}

export default Repository;
