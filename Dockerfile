FROM node

WORKDIR /app
COPY start.sh .

CMD ["sh" ,"-c", "start.sh"]