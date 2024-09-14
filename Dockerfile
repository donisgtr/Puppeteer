# Usar uma imagem base do Node.js
FROM node:16-slim

# Instalar dependências necessárias para o Puppeteer e o Chrome
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg \
    --no-install-recommends

# Adicionar a chave GPG do repositório do Google Chrome
RUN curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add -

# Adicionar o repositório do Google Chrome
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

# Instalar o Google Chrome estável
RUN apt-get update && apt-get install -y google-chrome-stable --no-install-recommends

# Definir variáveis de ambiente para o Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Criar a pasta de trabalho
WORKDIR /app

# Copiar os arquivos do projeto para a imagem Docker
COPY . .

# Instalar as dependências do projeto
RUN npm install

# Expor a porta que a aplicação vai usar
EXPOSE 3000

# Definir o comando para iniciar o servidor
CMD ["node", "index.js"]
