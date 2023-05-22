# E-commerece Back End
A lightweight express server for an e-commerce website built in node and sequelize
## Table of Contents
- [E-commerece Back End](#e-commerece-back-end)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [Questions](#questions)
  - [License ](#license-)
___
## Installation
Ensure you have nodejs and mysql server installed.  
Clone down the repository and run  
```bash  
npm i  
```  
This will install all dependencies.
Then create a .env file in the root directory of the project and add the following lines
```env
DB_NAME='ecommerce_db'
DB_USER=''
DB_PASSWORD=''
```
These can also be found in the .env.EXAMPLE file.
___
## Usage
Watch the following video for a walkthrough of the application:  
[![Walkthrough Video]()]()  
Navigate to the root directory of the project and start a mysql session. Then run
```sql
source db/schema.sql
```
This will initialize the database.  
If you want to seed the database with test data, run
```bash
npm run seed
```
To start the server, run
```bash
npm start
```
This will start the server, which can then be accessed by sending requests to localhost:3001. The port can be changed in the root server.js file.
___
## Testing
The included ```insomnia-test-suite.json``` file can be imported into insomnia to test the routes.
___
## Contributing
Contribute through GitHub forks and issues
___
## Questions
Contact [BizTheHabesha](https://github.com/BizTheHabesha) on GitHub with any questions or suggestions!
___
## License [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
Licensed MIT  

