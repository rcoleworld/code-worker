import CodeContainerFactory from '../lib/codeexecution/CodeContainerFactory';

test('Golang output simple', async () => {
  const code = `package main\nimport "fmt"\nfunc main() {\n\tfmt.Println("Hello World")\n}`;
  const golangContainer = CodeContainerFactory.getCodeContainer('golang', code);

  await golangContainer.initialize(); 
  const codeOutput = golangContainer.getOutput().trim().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~\n]*/g, '');

  expect(codeOutput).toBe('Hello World');
});
