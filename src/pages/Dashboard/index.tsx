import React, { useState, useEffect, FormEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import api from "../../services/api";
import logo from "../../assets/logo.svg";

import { Title, Form, Repositories, Error } from "./styles";

interface IRepository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState("");
  const [inputError, setInputError] = useState("");
  const [repositories, setRepositories] = useState<IRepository[]>(() => {
      const storagedRepositories = localStorage.getItem("@GithubExplorer:repositories");
      if (storagedRepositories){
          return JSON.parse(storagedRepositories);
      } else {
          return [];
      }
  });

  useEffect(() => {
    localStorage.setItem(
      "@GithubExplorer:repositories",
      JSON.stringify(repositories)
    );
  }, [repositories]);

  const handleAddRepository = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!newRepo) {
      setInputError("Digite <autor>/<nome do repositório>");
      return;
    }

    try {
      const response = await api.get<IRepository>(`/repos/${newRepo}`);

      const repository = response.data;
      setRepositories([repository, ...repositories]);
      setNewRepo("");
      setInputError("");
    } catch (error) {
      setInputError("Repositório não encontrado.");
    }
  };

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>
        Explore repositórios
        <br />
        no Github
      </Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => {
          return (
            <a key={repository.full_name} href="teste">
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description}</p>
              </div>

              <FiChevronRight size={20} />
            </a>
          );
        })}
      </Repositories>
    </>
  );
};

export default Dashboard;
