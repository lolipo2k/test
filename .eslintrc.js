module.exports = {
    // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
    // This option interrupts the configuration hierarchy at this file
    // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
    root: true,
  
    // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
    // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
    // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
    parserOptions: {
      parser: require.resolve('@typescript-eslint/parser'),
      extraFileExtensions: [ '.vue' ]
    },
  
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
  
    // Rules order is important, please avoid shuffling them
    extends: [
      // Base ESLint recommended rules
      // 'eslint:recommended',
  
      // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
      // ESLint typescript rules
      'plugin:@typescript-eslint/recommended',
      'plugin:nestjs/recommended',

  
      // https://github.com/prettier/eslint-config-prettier#installation
      // usage with Prettier, provided by 'eslint-config-prettier'.
      'prettier',
    ],
  
    plugins: [
      // required to apply rules which need type information
      '@typescript-eslint',
    ],
  
    globals: {
      process: 'readonly',
    },
  
    // add your custom rules here
    rules: {
      // Требовать использования объектов Error в качестве причин отклонения обещания
      'prefer-promise-reject-errors': 'off',
      // Запретить возвращаемые значения из функций-исполнителей промисов
      'no-floating-promise': 0,
  
      // TypeScript
      // Требуются явные возвращаемые типы для функций и методов класса.
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Требуются явные возвращаемые значения и типы аргументов в методах открытых классов экспортируемых функций и классов.
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Требуется, чтобы операторы, подобные Promise, обрабатывались должным образом.
      '@typescript-eslint/no-floating-promises': 'off',
      // Запрещает перебор массива с помощью цикла for-in.
      '@typescript-eslint/no-for-in-array': 'off',
      // Запрещает присваивать значение типа anyпеременным и свойствам.
      '@typescript-eslint/no-unsafe-assignment': 'off',
      // Запрещает доступ членов к значению типа any.
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // Требуются аннотации типа в определенных местах.
      '@typescript-eslint/typedef': 'error',
      // Запрещает явные объявления типов для переменных или параметров, инициализированных числом, строкой или логическим значением.
      '@typescript-eslint/no-inferrable-types': 'off',
      // Требует, чтобы оба операнда сложения имели тип numberили string.
      '@typescript-eslint/restrict-plus-operands': 'off',
      // Принудительно вызывает несвязанные методы с их ожидаемой областью действия.
      '@typescript-eslint/unbound-method': 'off',
      // Запрещает возвращать значение с типом anyиз функции.
      '@typescript-eslint/no-unsafe-return': 'off',
      // Запрещает вызов значения с типом any.
      '@typescript-eslint/no-unsafe-call': 'off',
      // Запрещает вызов функции со значением типа any.
      '@typescript-eslint/no-unsafe-argument': 'off',
      // Применяется , если не указан глобальный флаг RegExp#exec.String#match
      '@typescript-eslint/prefer-regexp-exec': 'off',
      // Запрещает обещания в местах, не предназначенных для их обработки.
      '@typescript-eslint/no-misused-promises': 'off',
      // Запрещает пользовательские модули и пространства имен TypeScript.
      '@typescript-eslint/no-namespace': 'off',
      // Принуждает литеральные выражения шаблона иметь stringтип.
      '@typescript-eslint/restrict-template-expressions': 'off',
      // Запрещает ненулевые утверждения с использованием !постфиксного оператора.
      '@typescript-eslint/no-non-null-assertion': 'off',
      // no-explicit-any
      '@typescript-eslint/no-explicit-any': 'off',
      // Запрещает неиспользуемые переменные.
      '@typescript-eslint/no-unused-vars': 'error',
      // Запрещает requireоператоры, кроме операторов импорта.
      '@typescript-eslint/no-var-requires': 'off',
      // Запретить неиспользуемые переменные
      'no-unused-vars': 'off',
  
      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      // Отключние проверка на название компонентов
      'vue/multi-word-component-names': 0,
      // Отступ перед templae style script
      //"indent": ["error", "tab"],
      // Запрещаем var вместо него let const
      'no-var': 'error',
      // Одинарные ковычки
      quotes: ['error', 'single'],
      // Интервал между блоками
      'space-before-blocks': 'error',
      // Обеспечьте постоянный интервал перед functionоткрывающей скобкой определения
      'space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
      // Обеспечьте постоянный интервал до и после стрелки в стрелочных функциях
      'arrow-spacing': 'error',
      // Требовать круглых скобок вокруг аргументов стрелочной функции
      'arrow-parens': 'error',
      // Запретить стрелочные функции, если их можно спутать со сравнениями.
      'no-confusing-arrow': 'error',
      // Запретить неправильные пробелы
      'no-irregular-whitespace': 'off',
      // Принудительное расположение тел функций стрелок
      'implicit-arrow-linebreak': 'error',
      // Запретить повторяющиеся члены класса
      'no-dupe-class-members': 'error',
      // Требовать использования ===и!==
      eqeqeq: ['off', 'smart'],
      // Запретить использованиеeval()
      'no-eval': 'error',
      // Обеспечьте согласованный стиль фигурных скобок для всех операторов управления
      curly: ['error', 'all'],
      // Точка запятой в конце строки
      semi: [2, 'always'],
      // Запретить использование console
      'no-console': 1,
      // Запретить несколько пустых строк
      'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 0 }],
      // Обеспечить постоянный интервал до и после ключевых слов
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      // Запрещает пользовательские модули и пространства имен TypeScript.
      'no-namespace': 'off',
      // Обеспечьте максимальное количество строк кода в функции
      'max-lines-per-function': ['error', {'max': 55, 'skipComments': true, 'skipBlankLines': true}],
      // Принудительное размещение свойств объекта на отдельных строках
      'object-property-newline': 'off',
    }
  };