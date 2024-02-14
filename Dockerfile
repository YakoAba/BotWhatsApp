# Use a imagem oficial do Node.js
FROM node:latest

# Instale o Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    && apt-get install -y chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o código fonte para o contêiner
COPY . .

# Instale as dependências do Node.js
RUN npm install

# Exponha a porta necessária
EXPOSE 8080

# Comando para iniciar o aplicativo
CMD ["node", "app.js"]
