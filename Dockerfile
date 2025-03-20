FROM node:18
WORKDIR /app
COPY . /app
RUN npm install express csv-parser
CMD ["node", "index.js"]
EXPOSE 5000