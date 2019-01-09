/*global expect, expectWithUnexpectedMagicPen*/
describe('function type', () => {
  it('should inspect an empty anonymous function correctly', () => {
    expect(function() {}, 'to inspect as', 'function () {}');
  });

  it('should inspect an empty named function correctly', () => {
    expect(function foo() {}, 'to inspect as', 'function foo() {}');
  });

  it('should inspect a function with a custom toString correctly', () => {
    var fn = function foo() {};
    fn.toString = 'breakage';
    expect(fn, 'to inspect as', 'function foo() {}');
  });

  var isIE =
    typeof navigator !== 'undefined' &&
    navigator.userAgent.indexOf('Trident') !== -1;

  if (!isIE) {
    // For now let's just disable these tests in those environments

    it('should inspect an anonymous bound function correctly', () => {
      expect(
        // eslint-disable-next-line no-extra-bind
        function() {}.bind({}),
        'to inspect as',
        'function bound () { /* native code */ }'
      );
    });

    it('should inspect a named bound function correctly', () => {
      expect(
        // eslint-disable-next-line no-extra-bind
        function foo() {}.bind({}),
        'to inspect as',
        'function bound foo() { /* native code */ }'
      );
    });
  }

  it('should inspect an function with just a newline correctly', () => {
    expect(function() {}, 'to inspect as', 'function () {}');
  });

  it('should inspect a one-line function correctly', () => {
    /* eslint-disable no-unused-vars */
    expect(
      // prettier-ignore
      function() { var a = 123;a = 456; },
      'to inspect as',
      'function () { var a = 123;a = 456; }'
    );
    /* eslint-enable no-unused-vars */
  });

  it('should inspect a short one-line function with leading and trailing newline correctly', () => {
    /* eslint-disable no-unused-vars */
    expect(
      // prettier-ignore
      function() { var a = 123;a = 456; },
      'to inspect as',
      'function () { var a = 123;a = 456; }'
    );
    /* eslint-enable no-unused-vars */
  });

  it('should inspect a long one-line function with leading and trailing newline correctly', () => {
    /* eslint-disable no-unused-vars */
    expect(
      // prettier-ignore
      function() {
        var a = 123 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2;a = 456;
      },
      'to inspect as',
      'function () {\n' +
        '  var a = 123 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2;a = 456;\n' +
        '}'
    );
    /* eslint-enable no-unused-vars */
  });

  /* eslint-disable no-unused-vars */
  function singleLineWithComment() {
    var a = 123;
    a = 456; // foo
  }
  /* eslint-enable no-unused-vars */

  it('should inspect a short one-line function with leading and trailing newline correctly and a C++-style comment correctly', () => {
    /* eslint-disable no-unused-vars */
    expect(
      // prettier-ignore
      function() {
          var a = 123;a = 456; // foo
        },
      'to inspect as',
      'function () {\n' + '  var a = 123;a = 456; // foo\n' + '}'
    );
    /* eslint-enable no-unused-vars */
  });

  it('should reindent a function with an indentation size of 4', () => {
    expect(
      function() {
        var a = 4;
        if (a === 1) {
          a();
        }
      },
      'to inspect as',
      'function () {\n' +
        '  var a = 4;\n' +
        '  if (a === 1) {\n' +
        '    a();\n' +
        '  }\n' +
        '}'
    );
  });

  it('should reindent a function with an indentation size of 3', () => {
    // jscs:disable
    expect(
      function() {
        var a = 4;
        if (a === 1) {
          a();
        }
      },
      'to inspect as',
      'function () {\n' +
        '  var a = 4;\n' +
        '  if (a === 1) {\n' +
        '    a();\n' +
        '  }\n' +
        '}'
    );
    // jscs:enable
  });

  it('should reindent a function with an indentation size of 1', () => {
    // jscs:disable
    expect(
      function() {
        var a = 4;
        if (a === 1) {
          a();
        }
      },
      'to inspect as',
      'function () {\n' +
        '  var a = 4;\n' +
        '  if (a === 1) {\n' +
        '    a();\n' +
        '  }\n' +
        '}'
    );
    // jscs:enable
  });

  // We can't complete this test if the runtime doesn't support arrow functions:
  var singleParamArrowFunction;
  try {
    // eslint-disable-next-line no-new-func
    singleParamArrowFunction = new Function('return a => a + 1;')();
  } catch (e) {}

  if (singleParamArrowFunction) {
    it('should render a single param arrow function', () => {
      expect(singleParamArrowFunction, 'to inspect as', 'a => a + 1');
    });
  }

  // We can't complete this test if the runtime doesn't support arrow functions:
  var implicitReturnMultilineArrowFunction;
  try {
    // eslint-disable-next-line no-new-func
    implicitReturnMultilineArrowFunction = new Function(
      'return a => \n    a + 1;'
    )();
  } catch (e) {}

  if (implicitReturnMultilineArrowFunction) {
    it('should render an implicit return multiline arrow function', () => {
      expect(
        implicitReturnMultilineArrowFunction,
        'to inspect as',
        'a => \n    a + 1'
      );
    });
  }

  var implicitReturnArrowFunction;
  try {
    // eslint-disable-next-line no-new-func
    implicitReturnArrowFunction = new Function('return a =>\n  a')();
  } catch (e) {}

  if (implicitReturnArrowFunction) {
    it('should render an implicit return arrow function a single line break after the arrow', () => {
      expect(implicitReturnArrowFunction, 'to inspect as', `a =>\n  a`);
    });
  }

  var implicitReturnArrowFunctionWith4SpaceIndent;
  try {
    // eslint-disable-next-line no-new-func
    implicitReturnArrowFunctionWith4SpaceIndent = new Function(
      'return a =>\n    a'
    )();
  } catch (e) {}

  if (implicitReturnArrowFunctionWith4SpaceIndent) {
    it('should reindent an implicit return arrow function with a single line break after the arrow', () => {
      expect(
        implicitReturnArrowFunctionWith4SpaceIndent,
        'to inspect as',
        `a =>\n  a`
      );
    });
  }

  // We can't complete this test if the runtime doesn't support arrow functions:
  var evilImplicitReturnMultilineArrowFunction;
  try {
    // eslint-disable-next-line no-new-func
    evilImplicitReturnMultilineArrowFunction = new Function(
      'return a => \n    a || {};'
    )();
  } catch (e) {}

  if (evilImplicitReturnMultilineArrowFunction) {
    it('should render an implicit return multiline arrow function with an evil alternation', () => {
      expect(
        evilImplicitReturnMultilineArrowFunction,
        'to inspect as',
        'a => \n    a || {}'
      );
    });
  }

  // We can't complete this test if the runtime doesn't support arrow functions:
  var arrowFunctionWith1SpaceIndentAndLeadingNewline;
  try {
    // eslint-disable-next-line no-new-func
    arrowFunctionWith1SpaceIndentAndLeadingNewline = new Function(
      'return () =>\n foo(\n  1\n )'
    )();
  } catch (e) {}

  if (arrowFunctionWith1SpaceIndentAndLeadingNewline) {
    it('should reindent an implicit return multiline arrow function with 1 space indent', () => {
      expect(
        arrowFunctionWith1SpaceIndentAndLeadingNewline,
        'to inspect as',
        '() =>\n  foo(\n    1\n  )'
      );
    });
  }

  // We can't complete this test if the runtime doesn't support arrow functions:
  var arrowFunctionWith2SpaceIndentAndLeadingNewline;
  try {
    // eslint-disable-next-line no-new-func
    arrowFunctionWith2SpaceIndentAndLeadingNewline = new Function(
      'return () =>\n        foo(\n          1\n        )'
    )();
  } catch (e) {}

  if (arrowFunctionWith2SpaceIndentAndLeadingNewline) {
    it('should reindent an implicit return multiline arrow function with 2 space indent', () => {
      expect(
        arrowFunctionWith2SpaceIndentAndLeadingNewline,
        'to inspect as',
        '() =>\n  foo(\n    1\n  )'
      );
    });
  }

  // We can't complete this test if the runtime doesn't support arrow functions:
  var arrowFunctionWith3SpaceIndentAndLeadingNewline;
  try {
    // eslint-disable-next-line no-new-func
    arrowFunctionWith3SpaceIndentAndLeadingNewline = new Function(
      'return () =>\n      foo(\n         1\n      )'
    )();
  } catch (e) {}

  if (arrowFunctionWith3SpaceIndentAndLeadingNewline) {
    it('should reindent an implicit return multiline arrow function with 4 space indent', () => {
      expect(
        arrowFunctionWith3SpaceIndentAndLeadingNewline,
        'to inspect as',
        '() =>\n  foo(\n    1\n  )'
      );
    });
  }

  // We can't complete this test if the runtime doesn't support arrow functions:
  var arrowFunctionWith4SpaceIndentAndLeadingNewline;
  try {
    // eslint-disable-next-line no-new-func
    arrowFunctionWith4SpaceIndentAndLeadingNewline = new Function(
      'return () =>\n        foo(\n            1\n        )'
    )();
  } catch (e) {}

  if (arrowFunctionWith4SpaceIndentAndLeadingNewline) {
    it('should reindent an implicit return multiline arrow function with long leading indent', () => {
      expect(
        arrowFunctionWith4SpaceIndentAndLeadingNewline,
        'to inspect as',
        '() =>\n  foo(\n    1\n  )'
      );
    });
  }

  // We can't complete this test if the runtime doesn't support arrow functions:
  var multiParamArrowFunction;
  try {
    // eslint-disable-next-line no-new-func
    multiParamArrowFunction = new Function('return (a, b) => a + b;')();
  } catch (e) {}

  if (multiParamArrowFunction) {
    it('should render a multi param arrow function', () => {
      expect(multiParamArrowFunction, 'to inspect as', '(a, b) => a + b');
    });
  }

  // We can't complete this test if the runtime doesn't support the async keyword:
  var asyncFunction;
  try {
    // eslint-disable-next-line no-new-func
    asyncFunction = new Function(
      'return async function foo(a) {return a + 1;}'
    )();
  } catch (e) {}

  if (asyncFunction) {
    it('should render "async" before an AsyncFunction instance', () => {
      expect(
        asyncFunction,
        'to inspect as',
        'async function foo(a) { return a + 1; }'
      );
    });
  }

  // We can't complete this test if the runtime doesn't support the class syntax:
  var anonymousClass;
  try {
    // eslint-disable-next-line no-new-func
    anonymousClass = new Function('return class {}')();
  } catch (e) {}

  if (anonymousClass) {
    it('should inspect an anonymous class', () => {
      expect(anonymousClass, 'to inspect as', 'class {}');
    });
  }

  // We can't complete this test if the runtime doesn't support the class syntax:
  var emptyClass;
  try {
    // eslint-disable-next-line no-new-func
    emptyClass = new Function('return class Foo {}')();
  } catch (e) {}

  if (emptyClass) {
    it('should inspect a class', () => {
      expect(emptyClass, 'to inspect as', 'class Foo {}');
    });
  }

  // We can't complete this test if the runtime doesn't support the class syntax:
  var classWithOneSpaceIndent;
  try {
    // eslint-disable-next-line no-new-func
    classWithOneSpaceIndent = new Function(
      'return class Foo {\n constructor(bar) {\n  this.bar = bar;\n }\n}'
    )();
  } catch (e) {}

  if (classWithOneSpaceIndent) {
    it('should inspect and reindent a non-empty class', () => {
      expect(
        classWithOneSpaceIndent,
        'to inspect as',
        'class Foo {\n' +
          '  constructor(bar) {\n' +
          '    this.bar = bar;\n' +
          '  }\n' +
          '}'
      );
    });
  }

  describe('diff()', function() {
    function foo() {}
    function bar() {}

    foo.baz = 123;

    describe('against another function', function() {
      it('should not produce a diff', function() {
        const functionType = expect.getType('function');
        expect(
          functionType.diff(foo, bar, expect.createOutput()),
          'to be undefined'
        );
      });
    });

    describe('against an object', function() {
      it('should delegate to the object diff', function() {
        const functionType = expect.getType('function');
        const diff = functionType.diff(
          foo,
          { baz: 456 },
          expect.createOutput()
        );
        expectWithUnexpectedMagicPen(
          diff,
          'to equal',
          expect
            .createOutput()
            .text('Mismatching constructors Function should be Object')
        );
      });
    });
  });
});
