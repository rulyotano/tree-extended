/* eslint-disable global-require */
import Configuration from '../../Configuration';
import helpText from '../helpText';
import printTreeExtendedResult from '../printTreeExtendedResult';

const FAKE_CUSTOM_PATH = 'custom-path';
const FAKE_RESULT = 'fake-result';
const mockedGetDirectoryTree = jest.fn(() => FAKE_RESULT);
jest.mock('../../treeExtended', () => ({
  __esModule: true,
  default: class T {
    getDirectoryTree = mockedGetDirectoryTree;
  },
}));

describe('bin > index.js', () => {
  let consoleLogSpy: jest.SpyInstance = null;

  beforeEach(() => {
    jest.resetModules();

    mockedGetDirectoryTree.mockClear();
    consoleLogSpy = jest.spyOn(console, 'log');
  });

  test('Default call should call treeExtended with default arguments', async () => {
    await printTreeExtendedResult();

    expect(mockedGetDirectoryTree).toHaveBeenCalledWith(undefined, new Configuration());
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });

  test('Should receive argument -charset={charset} and pass it to configuration', async () => {
    const fakeCharset = 'fake-charset';
    await printTreeExtendedResult([`-charset=${fakeCharset}`]);

    expect(mockedGetDirectoryTree).toHaveBeenCalledWith(undefined, new Configuration(fakeCharset));
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });

  test('when help argument should return help string', async () => {
    await printTreeExtendedResult(['-h']);

    expect(mockedGetDirectoryTree).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(helpText);
  });

  test('when all arguments should transform them correctly', async () => {
    const fakeCharset = 'fake-charset';
    await printTreeExtendedResult([
      FAKE_CUSTOM_PATH,
      '-max=4',
      '-max-show-not-empty',
      '-gitignore',
      '-ignore=1:ba, 2:bafile1, c',
      '-only=0:b, 1:bc, 2:bca',
      `-c=${fakeCharset}`,
    ]);

    expect(mockedGetDirectoryTree).toHaveBeenCalledWith(
      FAKE_CUSTOM_PATH,
      new Configuration(
        fakeCharset,
        4,
        true,
        true,
        '1:ba, 2:bafile1, c',
        '0:b, 1:bc, 2:bca'
      )
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });
});
