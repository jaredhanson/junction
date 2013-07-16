SOURCES = lib/junction/*.js lib/junction/**/*.js
TESTS = test/*-test.js test/**/*-test.js test/**/**/*-test.js

# ==============================================================================
# Node Tests
# ==============================================================================

VOWS = ./node_modules/.bin/vows

test: test-node
test-node: node_modules
	@NODE_ENV=test NODE_PATH=lib $(VOWS) $(TESTS)

node_modules:
	npm install


# ==============================================================================
# Code Quality
# ==============================================================================

JSHINT = jshint

hint: lint
lint:
	$(JSHINT) $(SOURCES)


# ==============================================================================
# Clean
# ==============================================================================

clean:
	rm -rf build

clobber: clean
	rm -rf node_modules
	rm -rf components
	rm -rf test/www/js/lib


.PHONY: test test-node hint lint clean clobber
