# API Testing (starter)

## Usage

- Run `git clone <repo-link>`
- Run `cd server`
- Run `npm install`

### Setup the database

- Create a `.env` file within `server` & add the following:
  
    ```sh
    PORT=<pick a port>
    ## use Supabase for both DB_URL & DB_TEST_URL
    DB_URL=<link-db>
    DB_TEST_URL=<link-test-db>
    ```
    
- Run `npm run seed-db` to setup the dev database

### Run the server

- Run `npm run dev` to start the API & the app should run on `3000` (if that's the port you've set in the `.env` file)

### Setup testing database

- Run `npm run setup-test-db` within `server` to setup the test database

### Run the tests & display test coverage

- Run `npm run test` to run the tests
- Run `npm run coverage` to display the test coverage


.env 
PORT=3000
DB_URL=postgresql://postgres.olhhgpbpmjdgaaqfecky:Password1234@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
DB_TEST_URL=postgresql://postgres.xrwsikclvrbkuvqhobjq:Password1234@aws-0-eu-west-2.pooler.supabase.com:6543/postgres