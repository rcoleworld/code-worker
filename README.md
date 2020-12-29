# Code Worker

## An engine for executing code via HTTP requests.

Installing:
```
git clone https://github.com/rcoleworld/code-worker.git
```

Before running:
Docker must be installed!
```
npm install
```
Note: the first request sent might take a while due to docker pull command.

To run: 
```
npm start
```

Example Requests:
```
POST /code?lang=python
BODY: {
  "code" : "print('Hello World')"
}

POST /code?lang=python
BODY: {
  "code" : "def hello():\n\tprint('hello')\nhello()"
}

```

Supported languages:
- Python
- Go

Goals:
- Clean output
- Enable ability to show errors when code is ran
- Rate limiting
- API key generation
- Website
- Discord bot incorporation
- Add more languages
- Add support for test cases
