import CodeContainerFactory from '../lib/codeexecution/CodeContainerFactory';

test('Python output simple', async () => {
  const code = `print('Hello World')`;
  const pythonContainer = CodeContainerFactory.getCodeContainer('python', code);

  await pythonContainer.initialize(); 
  const codeOutput = pythonContainer.getOutput().trim().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~\n]*/g, '');

  expect(codeOutput).toBe('Hello World');
})
