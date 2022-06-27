import FilterConfigurationItem, { EMPTY_DEEP } from '../FilterConfigurationItem';

describe('filters > FilterConfigurationItem', () => {
  describe('parse()', () => {
    test('When empty string argument should return null', () => {
      let result = FilterConfigurationItem.parse('');
      expect(result).toBeNull();

      result = FilterConfigurationItem.parse(' ');
      expect(result).toBeNull();
    });

    test('When string with only text should parse text with empty deep', () => {
      const testText = 'test-text';
      const result = FilterConfigurationItem.parse(testText);
      expect(result.deep).toBe(EMPTY_DEEP);
      expect(result.pattern).toBe(testText);
      expect(result.isMatch(`fake-${testText}`)).toBeTruthy();
    });

    test('When level:string format should parse it correctly', () => {
      const testText = 'test-text';
      const testLevel = 5;
      const result = FilterConfigurationItem.parse(`${testLevel}:${testText}`);
      expect(result.deep).toBe(testLevel);
      expect(result.pattern).toBe(testText);
      expect(result.isMatch(`fake-${testText}`, testLevel)).toBeTruthy();
    });

    test('When wrong format string:level should return null', () => {
      const testText = 'test-text';
      const testLevel = 5;
      const result = FilterConfigurationItem.parse(`${testText}:${testLevel}`);
      expect(result).toBeNull();
    });

    test('When wrong format more than one part string:level:other should return null', () => {
      const testText = 'test-text';
      const testLevel = 5;
      const result = FilterConfigurationItem.parse(`${testText}:${testLevel}:other`);
      expect(result).toBeNull();
    });
  });

  describe('parseArray()', () => {
    test('when empty string should return empty list', () => {
      const result = FilterConfigurationItem.parseArray('');
      expect(result).toHaveLength(0);
    });

    test('when all invalid segments should return empty list', () => {
      const result = FilterConfigurationItem.parseArray(',,1:abc:cd,,:');
      expect(result).toHaveLength(0);
    });

    test('when valid segments should valid list', () => {
      const result = FilterConfigurationItem.parseArray('abc,1:cde,3:tre');
      expect(result).toHaveLength(3);

      const [result1, result2, result3] = result;
      expect(result1.deep).toBe(EMPTY_DEEP);
      expect(result1.pattern).toBe('abc');
      expect(result2.deep).toBe(1);
      expect(result2.pattern).toBe('cde');
      expect(result3.deep).toBe(3);
      expect(result3.pattern).toBe('tre');
    });
  });

  describe('isMatch', () => {
    test('Should match when pattern and deep match', () => {
      const configItem = FilterConfigurationItem.parse('5:abc');
      expect(configItem.isMatch('abcdefg', 5)).toBeTruthy();
    });

    test('When same level but not matching text should not match', () => {
      const configItem = FilterConfigurationItem.parse('5:abc');
      expect(configItem.isMatch('defg', 5)).toBeFalsy();
    });

    test('When different levels should not match', () => {
      const configItem = FilterConfigurationItem.parse('5:abc');
      expect(configItem.isMatch('abc', 3)).toBeFalsy();
    });

    test('Not level in filter should match all levels', () => {
      const configItem = FilterConfigurationItem.parse('abc');
      expect(configItem.isMatch('abc', 3)).toBeTruthy();
      expect(configItem.isMatch('aaabcbb', 7)).toBeTruthy();
      expect(configItem.isMatch('aaabcbb')).toBeTruthy();
    });
    
    test('When level defined in filter but not in match, should also match', () => {
      const configItem = FilterConfigurationItem.parse('4:abc');
      expect(configItem.isMatch('abc')).toBeTruthy();
    });
  });
});
