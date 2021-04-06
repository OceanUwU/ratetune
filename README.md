# open-source-stories

## setup
1. `npm ci` or `npm install`
2. `npx sequelize db:migrate`
3. create a file called `cfg.json`, paste the following contents into it, and edit it to your needs
```json
{
    "port": 8080,
    "host": "http://localhost:8080",
    "identificatorHost": "https://id.ocean.lol",
    "secret": "someString"
}
```
4. `npm start` or `nodemon` if youre developing

## maybe todo one day
- group invite links
