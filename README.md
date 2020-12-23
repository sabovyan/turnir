# Tournament

How to initialize the app locally

set up your environment variables

```bash
DATABASE_URL=
PORT=
SENDGRID_API_KEY=
SENDGRID_MAIL_FROM=
SENDGRID_TEMPLATE_ID=
```

```bash
# this will migrate your schema, generate prisma client and run the studio
npm run prisma
```

then open a new terminal and run

```bash
# this script will open the app with ts-node and nodemon
npm run dev:ts

# otherwise run these two scripts below within two different terminals

# this script will run webpack and generate js files for you
npm run dev

# this script will run your generated js files
npm start
```
