
#### Realize o clone do repositório(necessário a configuração de uma chave [SSH](https://www.youtube.com/watch?v=B4p5P3UlD6I))


```
git clone git@github.com:Lufeltz/company.git
```
* Baixe todas as ferramentas necessárias para execução do projeto, para isso basta acessar o link do repositório abaixo e realizar o download das ferramentas necessárias.
    * [Repositório](https://github.com/Lufeltz/lol?tab=readme-ov-file#antes-de-executar-o-projeto-%C3%A9-necess%C3%A1rio-o-download-de-algumas-ferramentas) 


### Comandos uteis
```
// acessar o repositório clonado
cd company
```
```
// instalar os pacotes necessários
npm install
```
```
// iniciar projeto
ng serve
```
#### JSON-SERVER
```
// Executar o json server
json-server --watch .\company.json
```
#### COMPONENTE

```
// criar um componente
ng generate component caminho/local/criacao
```
```
// criar um componente abreviado
ng g c caminho/arquivo
```
```
// criar um componente sem o arquivo de test
ng g c auth/cadastro --skip-tests
```

#### SERVIÇO
```
// criar um serviço
ng generate service caminho/local/criacao
```
```
// criar um serviço abreviado
ng g s caminho/local/criacao
```
#### CLASSE

```
// criar uma classe
ng generate class caminho/local/criacao
```
```
// criar uma classe abreviado
ng g class caminho/local/criacao
```

#### MODEL
```
// criar um model
ng generate class caminho/local/criacao --type=model
```
```
// criar um model abreviado
ng g c caminho/local/criacao --type=model
```