var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*global afterEach, jasmine*/
var pendingPromisesForTheCurrentTest = [];
var afterEachRegistered = false;

var currentSpec = null;

if ((typeof jasmine === 'undefined' ? 'undefined' : _typeof(jasmine)) === 'object') {
    // Add a custom reporter that allows us to capture the name of the currently executing spec:
    jasmine.getEnv().addReporter({
        specStarted: function specStarted(spec) {
            currentSpec = spec;
        },
        specDone: function specDone(spec) {
            currentSpec = null;
        }
    });
}

function isPendingOrHasUnhandledRejection(promise) {
    return promise.isPending() || promise.isRejected() && promise.reason().uncaught;
}

function registerAfterEachHook() {
    if (typeof afterEach === 'function' && !afterEachRegistered) {
        afterEachRegistered = true;
        try {
            afterEach(function () {
                var error;
                var testPassed = true;
                if (pendingPromisesForTheCurrentTest.some(isPendingOrHasUnhandledRejection)) {
                    var displayName;
                    if (this.currentTest) {
                        // mocha
                        testPassed = this.currentTest.state === 'passed';
                        displayName = this.currentTest.title;
                    } else if ((typeof currentSpec === 'undefined' ? 'undefined' : _typeof(currentSpec)) === 'object') {
                        testPassed = currentSpec.failedExpectations.length === 0;
                        displayName = currentSpec.fullName;
                    }
                    error = new Error(displayName + ': You have created a promise that was not returned from the it block');
                }
                pendingPromisesForTheCurrentTest = [];
                if (error && testPassed) {
                    throw error;
                }
            });
        } catch (e) {
            // The benchmark suite fails when attempting to add an afterEach
        }
    }
}

// When running in jasmine/node.js, afterEach is available immediately,
// but doesn't work within the it block. Register the hook immediately:
registerAfterEachHook();

module.exports = function notifyPendingPromise(promise) {
    pendingPromisesForTheCurrentTest.push(promise);
    // Register the afterEach hook lazily (mocha/node.js):
    registerAfterEachHook();
};