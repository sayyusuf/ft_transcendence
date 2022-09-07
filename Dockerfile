FROM node

RUN npm install pm2 -g

WORKDIR /usr/src/app/


WORKDIR /usr/src/app/frontend
COPY srcs/frontend/ .
RUN npm install
RUN npm run build

WORKDIR /usr/src/app/backend/
COPY srcs/backend/ .
RUN npm install

EXPOSE 3000
EXPOSE 3334

ENTRYPOINT ["tail", "-f"]

CMD cd /usr/src/app/backend && npx prisma migrate deploy && pm2 --name nestjs start npm -- start && cd /usr/src/app/frontend && pm2 --name react start npx -- serve -s build