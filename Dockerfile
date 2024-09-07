FROM node:14

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    python \
    make \
    g++ \
    sqlite3

WORKDIR /usr/src/app

COPY package*.json ./
    
RUN npm install
    
RUN npm rebuild sqlite3
        
COPY . .
    
EXPOSE 5000
    
CMD ["node", "index.js"]