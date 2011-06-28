NODE = node
TEST = vows
TESTS ?= test/*-test.js test/**/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

.PHONY: test
