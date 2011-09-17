NODE = node
TEST = vows
TESTS ?= test/*-test.js test/**/*-test.js test/**/**/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/junction/*.js
	dox \
		--title Junction \
		--desc "XMPP middleware framework" \
		$(shell find lib/junction/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
