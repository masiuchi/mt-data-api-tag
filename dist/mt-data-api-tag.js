/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// top
	__webpack_require__(1);

	// riot custom tags
	// these will be mounted after initializing DataAPI client in MTDataAPITag.js
	__webpack_require__(7);
	__webpack_require__(18);
	__webpack_require__(32);
	__webpack_require__(39);
	__webpack_require__(45);
	__webpack_require__(46);
	__webpack_require__(60);
	__webpack_require__(66);
	__webpack_require__(78);
	__webpack_require__(88);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	module.exports = global["DataAPITag"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const riot = __webpack_require__(3)
	const DataAPI = __webpack_require__(5)

	module.exports = {
	  baseUrl: '',
	  clientId: 'mt-data-api-tag',
	  blogId: 0,
	  blog: null,
	  client: null,

	  rebuild: function (args) {
	    if (!args || !('baseUrl' in args)) {
	      console.log('baseUrl parameter is required')
	      return
	    } else {
	      this.baseUrl = args.baseUrl
	    }
	    if ('clientId' in args) {
	      this.clientId = args.clientId
	    }
	    if ('blogId' in args) {
	      this.blogId = args.blogId
	    }

	    const self = this
	    this.client = new DataAPI({
	      baseUrl: self.baseUrl,
	      clientId: self.clientId
	    })
	    if (this.blogId) {
	      this.client.getBlog(this.blogId, function(response) {
	        if (response.error) {
	          console.log(`cannot get blog (blog_id: ${self.blogId})`)
	          return
	        }
	        self.blog = response
	        riot.mount('*')
	      })
	    } else {
	      riot.mount('*')
	    }
	  }
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.6.7, @license MIT */

	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.6.7', settings: {} },
	  // be aware, internal usage
	  // ATTENTION: prefix the global dynamic variables with `__`

	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	  // tags instances cache
	  __virtualDom = [],
	  // tags implementation cache
	  __tagImpl = {},

	  /**
	   * Const
	   */
	  GLOBAL_MIXIN = '__global_mixin',

	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',
	  RIOT_TAG_IS = 'data-is',

	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  XLINK_NS = 'http://www.w3.org/1999/xlink',
	  XLINK_REGEX = /^xlink:(\w+)/,
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
	  RESERVED_WORDS_BLACKLIST = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,
	  // SVG tags list https://www.w3.org/TR/SVG/attindex.html#PresentationAttributes
	  SVG_TAGS_LIST = ['altGlyph', 'animate', 'animateColor', 'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'font', 'foreignObject', 'g', 'glyph', 'glyphRef', 'image', 'line', 'linearGradient', 'marker', 'mask', 'missing-glyph', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use'],

	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,

	  // detect firefox to fix #1374
	  FIREFOX = window && !!window.InstallTrigger
	/* istanbul ignore next */
	riot.observable = function(el) {

	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */

	  el = el || {}

	  /**
	   * Private variables
	   */
	  var callbacks = {},
	    slice = Array.prototype.slice

	  /**
	   * Private Methods
	   */

	  /**
	   * Helper function needed to get and loop all the events in a string
	   * @param   { String }   e - event string
	   * @param   {Function}   fn - callback
	   */
	  function onEachEvent(e, fn) {
	    var es = e.split(' '), l = es.length, i = 0
	    for (; i < l; i++) {
	      var name = es[i]
	      if (name) fn(name, i)
	    }
	  }

	  /**
	   * Public Api
	   */

	  // extend the el object adding the observable methods
	  Object.defineProperties(el, {
	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` each time an event is triggered.
	     * @param  { String } events - events ids
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */
	    on: {
	      value: function(events, fn) {
	        if (typeof fn != 'function')  return el

	        onEachEvent(events, function(name, pos) {
	          (callbacks[name] = callbacks[name] || []).push(fn)
	          fn.typed = pos > 0
	        })

	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },

	    /**
	     * Removes the given space separated list of `events` listeners
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    off: {
	      value: function(events, fn) {
	        if (events == '*' && !fn) callbacks = {}
	        else {
	          onEachEvent(events, function(name, pos) {
	            if (fn) {
	              var arr = callbacks[name]
	              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	                if (cb == fn) arr.splice(i--, 1)
	              }
	            } else delete callbacks[name]
	          })
	        }
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },

	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` at most once
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    one: {
	      value: function(events, fn) {
	        function on() {
	          el.off(events, on)
	          fn.apply(el, arguments)
	        }
	        return el.on(events, on)
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },

	    /**
	     * Execute all callback functions that listen to
	     * the given space separated list of `events`
	     * @param   { String } events - events ids
	     * @returns { Object } el
	     */
	    trigger: {
	      value: function(events) {

	        // getting the arguments
	        var arglen = arguments.length - 1,
	          args = new Array(arglen),
	          fns

	        for (var i = 0; i < arglen; i++) {
	          args[i] = arguments[i + 1] // skip first argument
	        }

	        onEachEvent(events, function(name, pos) {

	          fns = slice.call(callbacks[name] || [], 0)

	          for (var i = 0, fn; fn = fns[i]; ++i) {
	            if (fn.busy) continue
	            fn.busy = 1
	            fn.apply(el, fn.typed ? [name].concat(args) : args)
	            if (fns[i] !== fn) { i-- }
	            fn.busy = 0
	          }

	          if (callbacks['*'] && name != '*')
	            el.trigger.apply(el, ['*', name].concat(args))

	        })

	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    }
	  })

	  return el

	}
	/* istanbul ignore next */
	;(function(riot) {

	/**
	 * Simple client-side router
	 * @module riot-route
	 */


	var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
	  EVENT_LISTENER = 'EventListener',
	  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
	  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
	  HAS_ATTRIBUTE = 'hasAttribute',
	  REPLACE = 'replace',
	  POPSTATE = 'popstate',
	  HASHCHANGE = 'hashchange',
	  TRIGGER = 'trigger',
	  MAX_EMIT_STACK_LEVEL = 3,
	  win = typeof window != 'undefined' && window,
	  doc = typeof document != 'undefined' && document,
	  hist = win && history,
	  loc = win && (hist.location || win.location), // see html5-history-api
	  prot = Router.prototype, // to minify more
	  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
	  started = false,
	  central = riot.observable(),
	  routeFound = false,
	  debouncedEmit,
	  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0

	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}

	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
	    args = path.match(re)

	  if (args) return args.slice(1)
	}

	/**
	 * Simple/cheap debounce implementation
	 * @param   {function} fn - callback
	 * @param   {number} delay - delay in seconds
	 * @returns {function} debounced function
	 */
	function debounce(fn, delay) {
	  var t
	  return function () {
	    clearTimeout(t)
	    t = setTimeout(fn, delay)
	  }
	}

	/**
	 * Set the window listeners to trigger the routes
	 * @param {boolean} autoExec - see route.start
	 */
	function start(autoExec) {
	  debouncedEmit = debounce(emit, 1)
	  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
	  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	  doc[ADD_EVENT_LISTENER](clickEvent, click)
	  if (autoExec) emit(true)
	}

	/**
	 * Router class
	 */
	function Router() {
	  this.$ = []
	  riot.observable(this) // make it observable
	  central.on('stop', this.s.bind(this))
	  central.on('emit', this.e.bind(this))
	}

	function normalize(path) {
	  return path[REPLACE](/^\/|\/$/, '')
	}

	function isString(str) {
	  return typeof str == 'string'
	}

	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
	}

	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] == '#'
	    ? (href || loc.href || '').split(base)[1] || ''
	    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
	}

	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel == 0, first
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return

	  emitStackLevel++
	  emitStack.push(function() {
	    var path = getPathFromBase()
	    if (force || path != current) {
	      central[TRIGGER]('emit', path)
	      current = path
	    }
	  })
	  if (isRoot) {
	    while (first = emitStack.shift()) first() // stack increses within this call
	    emitStackLevel = 0
	  }
	}

	function click(e) {
	  if (
	    e.which != 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) return

	  var el = e.target
	  while (el && el.nodeName != 'A') el = el.parentNode

	  if (
	    !el || el.nodeName != 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target != '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
	  ) return

	  if (el.href != loc.href
	    && (
	      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
	      || base[0] != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
	      || base[0] == '#' && el.href.split(base)[0] != loc.href.split(base)[0] // outside of #base
	      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
	    )) return

	  e.preventDefault()
	}

	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 * @param {boolean} shouldReplace - use replaceState or pushState
	 * @returns {boolean} - route not found flag
	 */
	function go(path, title, shouldReplace) {
	  // Server-side usage: directly execute handlers for the path
	  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))

	  path = base + normalize(path)
	  title = title || doc.title
	  // browsers ignores the second parameter `title`
	  shouldReplace
	    ? hist.replaceState(null, title, path)
	    : hist.pushState(null, title, path)
	  // so we need to set it manually
	  doc.title = title
	  routeFound = false
	  emit()
	  return routeFound
	}

	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * two strings and boolean:        replace history with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 * @param {boolean} third - replace flag
	 */
	prot.m = function(first, second, third) {
	  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
	  else if (second) this.r(first, second)
	  else this.r('@', first)
	}

	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*')
	  this.$ = []
	}

	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
	    if (typeof args != 'undefined') {
	      this[TRIGGER].apply(null, [filter].concat(args))
	      return routeFound = true // exit from loop
	    }
	  }, this)
	}

	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter != '@') {
	    filter = '/' + normalize(filter)
	    this.$.push(filter)
	  }
	  this.on(filter, action)
	}

	var mainRouter = new Router()
	var route = mainRouter.m.bind(mainRouter)

	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router()
	  // assign sub-router's main method
	  var router = newSubRouter.m.bind(newSubRouter)
	  // stop only this sub-router
	  router.stop = newSubRouter.s.bind(newSubRouter)
	  return router
	}

	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#'
	  current = getPathFromBase() // recalculate current path
	}

	/** Exec routing right now **/
	route.exec = function() {
	  emit(true)
	}

	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER
	    secondParser = DEFAULT_SECOND_PARSER
	  }
	  if (fn) parser = fn
	  if (fn2) secondParser = fn2
	}

	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {}
	  var href = loc.href || current
	  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
	  return q
	}

	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    if (win) {
	      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
	      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
	    }
	    central[TRIGGER]('stop')
	    started = false
	  }
	}

	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    if (win) {
	      if (document.readyState == 'complete') start(autoExec)
	      // the timeout is needed to solve
	      // a weird safari bug https://github.com/riot/route/issues/33
	      else win[ADD_EVENT_LISTENER]('load', function() {
	        setTimeout(function() { start(autoExec) }, 1)
	      })
	    }
	    started = true
	  }
	}

	/** Prepare the router **/
	route.base()
	route.parser()

	riot.route = route
	})(riot)
	/* istanbul ignore next */

	/**
	 * The riot template engine
	 * @version v2.4.2
	 */
	/**
	 * riot.util.brackets
	 *
	 * - `brackets    ` - Returns a string or regex based on its parameter
	 * - `brackets.set` - Change the current riot brackets
	 *
	 * @module
	 */

	var brackets = (function (UNDEF) {

	  var
	    REGLOB = 'g',

	    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

	    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

	    S_QBLOCKS = R_STRINGS.source + '|' +
	      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

	    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

	    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

	    FINDBRACES = {
	      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
	      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
	      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
	    },

	    DEFAULT = '{ }'

	  var _pairs = [
	    '{', '}',
	    '{', '}',
	    /{[^}]*}/,
	    /\\([{}])/g,
	    /\\({)|{/g,
	    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
	    DEFAULT,
	    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
	    /(^|[^\\]){=[\S\s]*?}/
	  ]

	  var
	    cachedBrackets = UNDEF,
	    _regex,
	    _cache = [],
	    _settings

	  function _loopback (re) { return re }

	  function _rewrite (re, bp) {
	    if (!bp) bp = _cache
	    return new RegExp(
	      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
	    )
	  }

	  function _create (pair) {
	    if (pair === DEFAULT) return _pairs

	    var arr = pair.split(' ')

	    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
	      throw new Error('Unsupported brackets "' + pair + '"')
	    }
	    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '))

	    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
	    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
	    arr[6] = _rewrite(_pairs[6], arr)
	    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
	    arr[8] = pair
	    return arr
	  }

	  function _brackets (reOrIdx) {
	    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
	  }

	  _brackets.split = function split (str, tmpl, _bp) {
	    // istanbul ignore next: _bp is for the compiler
	    if (!_bp) _bp = _cache

	    var
	      parts = [],
	      match,
	      isexpr,
	      start,
	      pos,
	      re = _bp[6]

	    isexpr = start = re.lastIndex = 0

	    while ((match = re.exec(str))) {

	      pos = match.index

	      if (isexpr) {

	        if (match[2]) {
	          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
	          continue
	        }
	        if (!match[3]) {
	          continue
	        }
	      }

	      if (!match[1]) {
	        unescapeStr(str.slice(start, pos))
	        start = re.lastIndex
	        re = _bp[6 + (isexpr ^= 1)]
	        re.lastIndex = start
	      }
	    }

	    if (str && start < str.length) {
	      unescapeStr(str.slice(start))
	    }

	    return parts

	    function unescapeStr (s) {
	      if (tmpl || isexpr) {
	        parts.push(s && s.replace(_bp[5], '$1'))
	      } else {
	        parts.push(s)
	      }
	    }

	    function skipBraces (s, ch, ix) {
	      var
	        match,
	        recch = FINDBRACES[ch]

	      recch.lastIndex = ix
	      ix = 1
	      while ((match = recch.exec(s))) {
	        if (match[1] &&
	          !(match[1] === ch ? ++ix : --ix)) break
	      }
	      return ix ? s.length : recch.lastIndex
	    }
	  }

	  _brackets.hasExpr = function hasExpr (str) {
	    return _cache[4].test(str)
	  }

	  _brackets.loopKeys = function loopKeys (expr) {
	    var m = expr.match(_cache[9])

	    return m
	      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
	      : { val: expr.trim() }
	  }

	  _brackets.array = function array (pair) {
	    return pair ? _create(pair) : _cache
	  }

	  function _reset (pair) {
	    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
	      _cache = _create(pair)
	      _regex = pair === DEFAULT ? _loopback : _rewrite
	      _cache[9] = _regex(_pairs[9])
	    }
	    cachedBrackets = pair
	  }

	  function _setSettings (o) {
	    var b

	    o = o || {}
	    b = o.brackets
	    Object.defineProperty(o, 'brackets', {
	      set: _reset,
	      get: function () { return cachedBrackets },
	      enumerable: true
	    })
	    _settings = o
	    _reset(b)
	  }

	  Object.defineProperty(_brackets, 'settings', {
	    set: _setSettings,
	    get: function () { return _settings }
	  })

	  /* istanbul ignore next: in the browser riot is always in the scope */
	  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
	  _brackets.set = _reset

	  _brackets.R_STRINGS = R_STRINGS
	  _brackets.R_MLCOMMS = R_MLCOMMS
	  _brackets.S_QBLOCKS = S_QBLOCKS

	  return _brackets

	})()

	/**
	 * @module tmpl
	 *
	 * tmpl          - Root function, returns the template value, render with data
	 * tmpl.hasExpr  - Test the existence of a expression inside a string
	 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
	 */

	var tmpl = (function () {

	  var _cache = {}

	  function _tmpl (str, data) {
	    if (!str) return str

	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
	  }

	  _tmpl.haveRaw = brackets.hasRaw

	  _tmpl.hasExpr = brackets.hasExpr

	  _tmpl.loopKeys = brackets.loopKeys

	  // istanbul ignore next
	  _tmpl.clearCache = function () { _cache = {} }

	  _tmpl.errorHandler = null

	  function _logErr (err, ctx) {

	    if (_tmpl.errorHandler) {

	      err.riotData = {
	        tagName: ctx && ctx.root && ctx.root.tagName,
	        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
	      }
	      _tmpl.errorHandler(err)
	    }
	  }

	  function _create (str) {
	    var expr = _getTmpl(str)

	    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr

	    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
	  }

	  var
	    CH_IDEXPR = String.fromCharCode(0x2057),
	    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
	    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
	    RE_DQUOTE = /\u2057/g,
	    RE_QBMARK = /\u2057(\d+)~/g

	  function _getTmpl (str) {
	    var
	      qstr = [],
	      expr,
	      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1)

	    if (parts.length > 2 || parts[0]) {
	      var i, j, list = []

	      for (i = j = 0; i < parts.length; ++i) {

	        expr = parts[i]

	        if (expr && (expr = i & 1

	            ? _parseExpr(expr, 1, qstr)

	            : '"' + expr
	                .replace(/\\/g, '\\\\')
	                .replace(/\r\n?|\n/g, '\\n')
	                .replace(/"/g, '\\"') +
	              '"'

	          )) list[j++] = expr

	      }

	      expr = j < 2 ? list[0]
	           : '[' + list.join(',') + '].join("")'

	    } else {

	      expr = _parseExpr(parts[1], 0, qstr)
	    }

	    if (qstr[0]) {
	      expr = expr.replace(RE_QBMARK, function (_, pos) {
	        return qstr[pos]
	          .replace(/\r/g, '\\r')
	          .replace(/\n/g, '\\n')
	      })
	    }
	    return expr
	  }

	  var
	    RE_BREND = {
	      '(': /[()]/g,
	      '[': /[[\]]/g,
	      '{': /[{}]/g
	    }

	  function _parseExpr (expr, asText, qstr) {

	    expr = expr
	          .replace(RE_QBLOCK, function (s, div) {
	            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
	          })
	          .replace(/\s+/g, ' ').trim()
	          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')

	    if (expr) {
	      var
	        list = [],
	        cnt = 0,
	        match

	      while (expr &&
	            (match = expr.match(RE_CSNAME)) &&
	            !match.index
	        ) {
	        var
	          key,
	          jsb,
	          re = /,|([[{(])|$/g

	        expr = RegExp.rightContext
	        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]

	        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)

	        jsb  = expr.slice(0, match.index)
	        expr = RegExp.rightContext

	        list[cnt++] = _wrapExpr(jsb, 1, key)
	      }

	      expr = !cnt ? _wrapExpr(expr, asText)
	           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
	    }
	    return expr

	    function skipBraces (ch, re) {
	      var
	        mm,
	        lv = 1,
	        ir = RE_BREND[ch]

	      ir.lastIndex = re.lastIndex
	      while (mm = ir.exec(expr)) {
	        if (mm[0] === ch) ++lv
	        else if (!--lv) break
	      }
	      re.lastIndex = lv ? expr.length : ir.lastIndex
	    }
	  }

	  // istanbul ignore next: not both
	  var // eslint-disable-next-line max-len
	    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
	    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
	    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/

	  function _wrapExpr (expr, asText, key) {
	    var tb

	    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
	      if (mvar) {
	        pos = tb ? 0 : pos + match.length

	        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	          match = p + '("' + mvar + JS_CONTEXT + mvar
	          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
	        } else if (pos) {
	          tb = !JS_NOPROPS.test(s.slice(pos))
	        }
	      }
	      return match
	    })

	    if (tb) {
	      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
	    }

	    if (key) {

	      expr = (tb
	          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
	        ) + '?"' + key + '":""'

	    } else if (asText) {

	      expr = 'function(v){' + (tb
	          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
	        ) + ';return v||v===0?v:""}.call(this)'
	    }

	    return expr
	  }

	  _tmpl.version = brackets.version = 'v2.4.2'

	  return _tmpl

	})()

	/*
	  lib/browser/tag/mkdom.js

	  Includes hacks needed for the Internet Explorer version 9 and below
	  See: http://kangax.github.io/compat-table/es5/#ie8
	       http://codeplanet.io/dropping-ie8/
	*/
	var mkdom = (function _mkdom() {
	  var
	    reHasYield  = /<yield\b/i,
	    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig,
	    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
	    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
	  var
	    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
	    tblTags = IE_VERSION && IE_VERSION < 10
	      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/

	  /**
	   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
	   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
	   *
	   * @param   { String } templ  - The template coming from the custom tag definition
	   * @param   { String } [html] - HTML content that comes from the DOM element where you
	   *           will mount the tag, mostly the original tag in the page
	   * @param   { Boolean } checkSvg - flag needed to know if we need to force the svg rendering in case of loop nodes
	   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
	   */
	  function _mkdom(templ, html, checkSvg) {
	    var
	      match   = templ && templ.match(/^\s*<([-\w]+)/),
	      tagName = match && match[1].toLowerCase(),
	      el = mkEl('div', checkSvg && isSVGTag(tagName))

	    // replace all the yield tags with the tag inner html
	    templ = replaceYield(templ, html)

	    /* istanbul ignore next */
	    if (tblTags.test(tagName))
	      el = specialTags(el, templ, tagName)
	    else
	      setInnerHTML(el, templ)

	    el.stub = true

	    return el
	  }

	  /*
	    Creates the root element for table or select child elements:
	    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
	  */
	  function specialTags(el, templ, tagName) {
	    var
	      select = tagName[0] === 'o',
	      parent = select ? 'select>' : 'table>'

	    // trim() is important here, this ensures we don't have artifacts,
	    // so we can check if we have only one element inside the parent
	    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
	    parent = el.firstChild

	    // returns the immediate parent if tr/th/td/col is the only element, if not
	    // returns the whole tree, as this can include additional elements
	    if (select) {
	      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
	    } else {
	      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
	      var tname = rootEls[tagName]
	      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
	    }
	    return parent
	  }

	  /*
	    Replace the yield tag from any tag template with the innerHTML of the
	    original tag in the page
	  */
	  function replaceYield(templ, html) {
	    // do nothing if no yield
	    if (!reHasYield.test(templ)) return templ

	    // be careful with #1343 - string on the source having `$1`
	    var src = {}

	    html = html && html.replace(reYieldSrc, function (_, ref, text) {
	      src[ref] = src[ref] || text   // preserve first definition
	      return ''
	    }).trim()

	    return templ
	      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
	        return src[ref] || def || ''
	      })
	      .replace(reYieldAll, function (_, def) {        // yield without any "from"
	        return html || def || ''
	      })
	  }

	  return _mkdom

	})()

	/**
	 * Convert the item looped into an object used to extend the child tag properties
	 * @param   { Object } expr - object containing the keys used to extend the children tags
	 * @param   { * } key - value to assign to the new object returned
	 * @param   { * } val - value containing the position of the item in the array
	 * @returns { Object } - new object containing the values of the original item
	 *
	 * The variables 'key' and 'val' are arbitrary.
	 * They depend on the collection type looped (Array, Object)
	 * and on the expression used on the each tag
	 *
	 */
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}

	/**
	 * Unmount the redundant tags
	 * @param   { Array } items - array containing the current items to loop
	 * @param   { Array } tags - array containing all the children tags
	 */
	function unmountRedundant(items, tags) {

	  var i = tags.length,
	    j = items.length,
	    t

	  while (i > j) {
	    t = tags[--i]
	    tags.splice(i, 1)
	    t.unmount()
	  }
	}

	/**
	 * Move the nested custom tags in non custom loop tags
	 * @param   { Object } child - non custom loop tag
	 * @param   { Number } i - current position of the loop tag
	 */
	function moveNestedTags(child, i) {
	  Object.keys(child.tags).forEach(function(tagName) {
	    var tag = child.tags[tagName]
	    if (isArray(tag))
	      each(tag, function (t) {
	        moveChildTag(t, tagName, i)
	      })
	    else
	      moveChildTag(tag, tagName, i)
	  })
	}

	/**
	 * Adds the elements for a virtual tag
	 * @param { Tag } tag - the tag whose root's children will be inserted or appended
	 * @param { Node } src - the node that will do the inserting or appending
	 * @param { Tag } target - only if inserting, insert before this tag's first child
	 */
	function addVirtual(tag, src, target) {
	  var el = tag._root, sib
	  tag._virts = []
	  while (el) {
	    sib = el.nextSibling
	    if (target)
	      src.insertBefore(el, target._root)
	    else
	      src.appendChild(el)

	    tag._virts.push(el) // hold for unmounting
	    el = sib
	  }
	}

	/**
	 * Move virtual tag and all child nodes
	 * @param { Tag } tag - first child reference used to start move
	 * @param { Node } src  - the node that will do the inserting
	 * @param { Tag } target - insert before this tag's first child
	 * @param { Number } len - how many child nodes to move
	 */
	function moveVirtual(tag, src, target, len) {
	  var el = tag._root, sib, i = 0
	  for (; i < len; i++) {
	    sib = el.nextSibling
	    src.insertBefore(el, target._root)
	    el = sib
	  }
	}

	/**
	 * Insert a new tag avoiding the insert for the conditional tags
	 * @param   {Boolean} isVirtual [description]
	 * @param   { Tag }  prevTag - tag instance used as reference to prepend our new tag
	 * @param   { Tag }  newTag - new tag to be inserted
	 * @param   { HTMLElement }  root - loop parent node
	 * @param   { Array }  tags - array containing the current tags list
	 * @param   { Function }  virtualFn - callback needed to move or insert virtual DOM
	 * @param   { Object } dom - DOM node we need to loop
	 */
	function insertTag(isVirtual, prevTag, newTag, root, tags, virtualFn, dom) {
	  if (isInStub(prevTag.root)) return
	  if (isVirtual) virtualFn(prevTag, root, newTag, dom.childNodes.length)
	  else root.insertBefore(prevTag.root, newTag.root) // #1374 some browsers reset selected here
	}


	/**
	 * Manage tags having the 'each'
	 * @param   { Object } dom - DOM node we need to loop
	 * @param   { Tag } parent - parent tag instance where the dom node is contained
	 * @param   { String } expr - string contained in the 'each' attribute
	 */
	function _each(dom, parent, expr) {

	  // remove the each property from the original tag
	  remAttr(dom, 'each')

	  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
	    tagName = getTagName(dom),
	    impl = __tagImpl[tagName] || { tmpl: getOuterHTML(dom) },
	    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
	    root = dom.parentNode,
	    ref = document.createTextNode(''),
	    child = getTag(dom),
	    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
	    tags = [],
	    oldItems = [],
	    hasKeys,
	    isVirtual = dom.tagName == 'VIRTUAL'

	  // parse the each expression
	  expr = tmpl.loopKeys(expr)

	  // insert a marked where the loop tags will be injected
	  root.insertBefore(ref, dom)

	  // clean template code
	  parent.one('before-mount', function () {

	    // remove the original DOM node
	    dom.parentNode.removeChild(dom)
	    if (root.stub) root = parent.root

	  }).on('update', function () {
	    // get the new items collection
	    var items = tmpl(expr.val, parent),
	      // create a fragment to hold the new DOM nodes to inject in the parent tag
	      frag = document.createDocumentFragment()

	    // object loop. any changes cause full redraw
	    if (!isArray(items)) {
	      hasKeys = items || false
	      items = hasKeys ?
	        Object.keys(items).map(function (key) {
	          return mkitem(expr, key, items[key])
	        }) : []
	    }

	    // loop all the new items
	    var i = 0,
	      itemsLength = items.length

	    for (; i < itemsLength; i++) {
	      // reorder only if the items are objects
	      var
	        item = items[i],
	        _mustReorder = mustReorder && typeof item == T_OBJECT && !hasKeys,
	        oldPos = oldItems.indexOf(item),
	        pos = ~oldPos && _mustReorder ? oldPos : i,
	        // does a tag exist in this position?
	        tag = tags[pos]

	      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item

	      // new tag
	      if (
	        !_mustReorder && !tag // with no-reorder we just update the old tags
	        ||
	        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
	      ) {

	        tag = new Tag(impl, {
	          parent: parent,
	          isLoop: true,
	          hasImpl: !!__tagImpl[tagName],
	          root: useRoot ? root : dom.cloneNode(),
	          item: item
	        }, dom.innerHTML)

	        tag.mount()

	        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
	        // this tag must be appended
	        if (i == tags.length || !tags[i]) { // fix 1581
	          if (isVirtual)
	            addVirtual(tag, frag)
	          else frag.appendChild(tag.root)
	        }
	        // this tag must be insert
	        else {
	          insertTag(isVirtual, tag, tags[i], root, tags, addVirtual, dom)
	          oldItems.splice(i, 0, item)
	        }

	        tags.splice(i, 0, tag)
	        pos = i // handled here so no move
	      } else tag.update(item, true)

	      // reorder the tag if it's not located in its previous position
	      if (
	        pos !== i && _mustReorder &&
	        tags[i] // fix 1581 unable to reproduce it in a test!
	      ) {
	        // #closes 2040 PLEASE DON'T REMOVE IT!
	        // there are no tests for this feature
	        if (contains(items, oldItems[i]))
	          insertTag(isVirtual, tag, tags[i], root, tags, moveVirtual, dom)

	        // update the position attribute if it exists
	        if (expr.pos)
	          tag[expr.pos] = i
	        // move the old tag instance
	        tags.splice(i, 0, tags.splice(pos, 1)[0])
	        // move the old item
	        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
	        // if the loop tags are not custom
	        // we need to move all their custom tags into the right position
	        if (!child && tag.tags) moveNestedTags(tag, i)
	      }

	      // cache the original item to use it in the events bound to this node
	      // and its children
	      tag._item = item
	      // cache the real parent tag internally
	      defineProperty(tag, '_parent', parent)
	    }

	    // remove the redundant tags
	    unmountRedundant(items, tags)

	    // insert the new nodes
	    root.insertBefore(frag, ref)
	    if (isOption) {

	      // #1374 FireFox bug in <option selected={expression}>
	      if (FIREFOX && !root.multiple) {
	        for (var n = 0; n < root.length; n++) {
	          if (root[n].__riot1374) {
	            root.selectedIndex = n  // clear other options
	            delete root[n].__riot1374
	            break
	          }
	        }
	      }
	    }

	    // set the 'tags' property of the parent tag
	    // if child is 'undefined' it means that we don't need to set this property
	    // for example:
	    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
	    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
	    if (child) parent.tags[tagName] = tags

	    // clone the items array
	    oldItems = items.slice()

	  })

	}
	/**
	 * Object that will be used to inject and manage the css of every tag instance
	 */
	var styleManager = (function(_riot) {

	  if (!window) return { // skip injection on the server
	    add: function () {},
	    inject: function () {}
	  }

	  var styleNode = (function () {
	    // create a new style element with the correct type
	    var newNode = mkEl('style')
	    setAttr(newNode, 'type', 'text/css')

	    // replace any user node or insert the new one into the head
	    var userNode = $('style[type=riot]')
	    if (userNode) {
	      if (userNode.id) newNode.id = userNode.id
	      userNode.parentNode.replaceChild(newNode, userNode)
	    }
	    else document.getElementsByTagName('head')[0].appendChild(newNode)

	    return newNode
	  })()

	  // Create cache and shortcut to the correct property
	  var cssTextProp = styleNode.styleSheet,
	    stylesToInject = ''

	  // Expose the style node in a non-modificable property
	  Object.defineProperty(_riot, 'styleNode', {
	    value: styleNode,
	    writable: true
	  })

	  /**
	   * Public api
	   */
	  return {
	    /**
	     * Save a tag style to be later injected into DOM
	     * @param   { String } css [description]
	     */
	    add: function(css) {
	      stylesToInject += css
	    },
	    /**
	     * Inject all previously saved tag styles into DOM
	     * innerHTML seems slow: http://jsperf.com/riot-insert-style
	     */
	    inject: function() {
	      if (stylesToInject) {
	        if (cssTextProp) cssTextProp.cssText += stylesToInject
	        else styleNode.innerHTML += stylesToInject
	        stylesToInject = ''
	      }
	    }
	  }

	})(riot)


	function parseNamedElements(root, tag, childTags, forceParsingNamed) {

	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop ||
	                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
	                    ? 1 : 0

	      // custom child tag
	      if (childTags) {
	        var child = getTag(dom)

	        if (child && !dom.isLoop)
	          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
	      }

	      if (!dom.isLoop || forceParsingNamed)
	        setNamed(dom, tag, [])
	    }

	  })

	}

	function parseExpressions(root, tag, expressions) {

	  function addExpr(dom, val, extra) {
	    if (tmpl.hasExpr(val)) {
	      expressions.push(extend({ dom: dom, expr: val }, extra))
	    }
	  }

	  walk(root, function(dom) {
	    var type = dom.nodeType,
	      attr

	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return

	    /* element */

	    // loop
	    attr = getAttr(dom, 'each')

	    if (attr) { _each(dom, tag, attr); return false }

	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]

	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }

	    })

	    // skip custom tags
	    if (getTag(dom)) return false

	  })

	}
	function Tag(impl, conf, innerHTML) {

	  var self = riot.observable(this),
	    opts = inherit(conf.opts) || {},
	    parent = conf.parent,
	    isLoop = conf.isLoop,
	    hasImpl = conf.hasImpl,
	    item = cleanUpData(conf.item),
	    expressions = [],
	    childTags = [],
	    root = conf.root,
	    tagName = root.tagName.toLowerCase(),
	    attr = {},
	    propsInSyncWithParent = [],
	    dom

	  // only call unmount if we have a valid __tagImpl (has name property)
	  if (impl.name && root._tag) root._tag.unmount(true)

	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop

	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this

	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id

	  extend(this, { parent: parent, root: root, opts: opts}, item)
	  // protect the "tags" property from being overridden
	  defineProperty(this, 'tags', {})

	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (tmpl.hasExpr(val)) attr[el.name] = val
	  })

	  dom = mkdom(impl.tmpl, innerHTML, isLoop)

	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self

	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      var val = el.value
	      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[toCamel(name)] = tmpl(attr[name], ctx)
	    })
	  }

	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
	        self[key] = data[key]
	    }
	  }

	  function inheritFrom(target) {
	    each(Object.keys(target), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !RESERVED_WORDS_BLACKLIST.test(k) && contains(propsInSyncWithParent, k)

	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = target[k]
	      }
	    })
	  }

	  /**
	   * Update the tag expressions and options
	   * @param   { * }  data - data we want to use to extend the tag properties
	   * @param   { Boolean } isInherited - is this update coming from a parent tag?
	   * @returns { self }
	   */
	  defineProperty(this, 'update', function(data, isInherited) {

	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent in loop
	    if (isLoop) {
	      inheritFrom(self.parent)
	    }
	    // normalize the tag properties in case an item object was initially passed
	    if (data && isObject(item)) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)

	    // the updated event will be triggered
	    // once the DOM will be ready and all the re-flows are completed
	    // this is useful if you want to get the "real" root properties
	    // 4 ex: root.offsetWidth ...
	    if (isInherited && self.parent)
	      // closes #1599
	      self.parent.one('updated', function() { self.trigger('updated') })
	    else rAF(function() { self.trigger('updated') })

	    return this
	  })

	  defineProperty(this, 'mixin', function() {
	    each(arguments, function(mix) {
	      var instance,
	        props = [],
	        obj

	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix

	      // check if the mixin is a function
	      if (isFunction(mix)) {
	        // create the new mixin instance
	        instance = new mix()
	      } else instance = mix

	      var proto = Object.getPrototypeOf(instance)

	      // build multilevel prototype inheritance chain property list
	      do props = props.concat(Object.getOwnPropertyNames(obj || instance))
	      while (obj = Object.getPrototypeOf(obj || instance))

	      // loop the keys in the function prototype or the all object keys
	      each(props, function(key) {
	        // bind methods to self
	        // allow mixins to override other properties/parent mixins
	        if (key != 'init') {
	          // check for getters/setters
	          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key)
	          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set)

	          // apply method only if it does not already exist on the instance
	          if (!self.hasOwnProperty(key) && hasGetterSetter) {
	            Object.defineProperty(self, key, descriptor)
	          } else {
	            self[key] = isFunction(instance[key]) ?
	              instance[key].bind(self) :
	              instance[key]
	          }
	        }
	      })

	      // init method will be called automatically
	      if (instance.init) instance.init.bind(self)()
	    })
	    return this
	  })

	  defineProperty(this, 'mount', function() {

	    updateOpts()

	    // add global mixins
	    var globalMixin = riot.mixin(GLOBAL_MIXIN)

	    if (globalMixin)
	      for (var i in globalMixin)
	        if (globalMixin.hasOwnProperty(i))
	          self.mixin(globalMixin[i])

	    // children in loop should inherit from true parent
	    if (self._parent && self._parent.root.isLoop) {
	      inheritFrom(self._parent)
	    }

	    // initialiation
	    if (impl.fn) impl.fn.call(self, opts)

	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)

	    // mount the child tags
	    toggle(true)

	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs)
	      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
	    if (impl.attrs || hasImpl)
	      parseExpressions(self.root, self, expressions)

	    if (!self.parent || isLoop) self.update(item)

	    // internal use only, fixes #403
	    self.trigger('before-mount')

	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      root = dom.firstChild
	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) root = parent.root
	    }

	    defineProperty(self, 'root', root)

	    // parse the named dom nodes in the looped child
	    // adding them to the parent as well
	    if (isLoop)
	      parseNamedElements(self.root, self.parent, null, true)

	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  })


	  defineProperty(this, 'unmount', function(keepRootTag) {
	    var el = root,
	      p = el.parentNode,
	      ptag,
	      tagIndex = __virtualDom.indexOf(self)

	    self.trigger('before-unmount')

	    // remove this tag instance from the global virtualDom variable
	    if (~tagIndex)
	      __virtualDom.splice(tagIndex, 1)

	    if (p) {

	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._riot_id == self._riot_id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }

	      else
	        while (el.firstChild) el.removeChild(el.firstChild)

	      if (!keepRootTag)
	        p.removeChild(el)
	      else {
	        // the riot-tag and the data-is attributes aren't needed anymore, remove them
	        remAttr(p, RIOT_TAG_IS)
	        remAttr(p, RIOT_TAG) // this will be removed in riot 3.0.0
	      }

	    }

	    if (this._virts) {
	      each(this._virts, function(v) {
	        if (v.parentNode) v.parentNode.removeChild(v)
	      })
	    }

	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    self.isMounted = false
	    delete root._tag

	  })

	  // proxy function to bind updates
	  // dispatched from a parent tag
	  function onChildUpdate(data) { self.update(data, true) }

	  function toggle(isMount) {

	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

	    // listen/unlisten parent (events flow one way from parent to children)
	    if (!parent) return
	    var evt = isMount ? 'on' : 'off'

	    // the loop tags will be always in sync with the parent automatically
	    if (isLoop)
	      parent[evt]('unmount', self.unmount)
	    else {
	      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
	    }
	  }


	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)

	}
	/**
	 * Attach an event to a DOM node
	 * @param { String } name - event name
	 * @param { Function } handler - event callback
	 * @param { Object } dom - dom node
	 * @param { Tag } tag - tag instance
	 */
	function setEventHandler(name, handler, dom, tag) {

	  dom[name] = function(e) {

	    var ptag = tag._parent,
	      item = tag._item,
	      el

	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag._parent
	      }

	    // cross browser event fix
	    e = e || window.event

	    // override the event properties
	    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
	    if (isWritable(e, 'target')) e.target = e.srcElement
	    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode

	    e.item = item

	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }

	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }

	  }

	}


	/**
	 * Insert a DOM node replacing another one (used by if- attribute)
	 * @param   { Object } root - parent node
	 * @param   { Object } node - node replaced
	 * @param   { Object } before - node added
	 */
	function insertTo(root, node, before) {
	  if (!root) return
	  root.insertBefore(before, node)
	  root.removeChild(node)
	}

	/**
	 * Update the expressions in a Tag instance
	 * @param   { Array } expressions - expression that must be re evaluated
	 * @param   { Tag } tag - tag instance
	 */
	function update(expressions, tag) {

	  each(expressions, function(expr, i) {

	    var dom = expr.dom,
	      attrName = expr.attr,
	      value = tmpl(expr.expr, tag),
	      parent = expr.parent || expr.dom.parentNode

	    if (expr.bool) {
	      value = !!value
	    } else if (value == null) {
	      value = ''
	    }

	    // #1638: regression of #1612, update the dom only if the value of the
	    // expression was changed
	    if (expr.value === value) {
	      return
	    }
	    expr.value = value

	    // textarea and text nodes has no attribute name
	    if (!attrName) {
	      // about #815 w/o replace: the browser converts the value to a string,
	      // the comparison by "==" does too, but not in the server
	      value += ''
	      // test for parent avoids error with invalid assignment to nodeValue
	      if (parent) {
	        // cache the parent node because somehow it will become null on IE
	        // on the next iteration
	        expr.parent = parent
	        if (parent.tagName === 'TEXTAREA') {
	          parent.value = value                    // #1113
	          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
	        }                                         // will be available on 'updated'
	        else dom.nodeValue = value
	      }
	      return
	    }

	    // ~~#1612: look for changes in dom.value when updating the value~~
	    if (attrName === 'value') {
	      if (dom.value !== value) {
	        dom.value = value
	        setAttr(dom, attrName, value)
	      }
	      return
	    } else {
	      // remove original attribute
	      remAttr(dom, attrName)
	    }

	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)

	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	        add = function() { insertTo(stub.parentNode, stub, dom) },
	        remove = function() { insertTo(dom.parentNode, dom, stub) }

	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted)
	                el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        // otherwise we need to wait the updated event
	        else (tag.parent || tag).one('updated', remove)

	        dom.inStub = true
	      }
	    // show / hide
	    } else if (attrName === 'show') {
	      dom.style.display = value ? '' : 'none'

	    } else if (attrName === 'hide') {
	      dom.style.display = value ? 'none' : ''

	    } else if (expr.bool) {
	      dom[attrName] = value
	      if (value) setAttr(dom, attrName, attrName)
	      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
	        dom.__riot1374 = value   // #1374
	      }

	    } else if (value === 0 || value && typeof value !== T_OBJECT) {
	      // <img src="{ expr }">
	      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	        attrName = attrName.slice(RIOT_PREFIX.length)
	      }
	      setAttr(dom, attrName, value)
	    }

	  })

	}
	/**
	 * Specialized function for looping an array-like collection with `each={}`
	 * @param   { Array } els - collection of items
	 * @param   {Function} fn - callback function
	 * @returns { Array } the array looped
	 */
	function each(els, fn) {
	  var len = els ? els.length : 0

	  for (var i = 0, el; i < len; i++) {
	    el = els[i]
	    // return false -> current item was removed by fn during the loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}

	/**
	 * Detect if the argument passed is a function
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}

	/**
	 * Get the outer html of any DOM node SVGs included
	 * @param   { Object } el - DOM node to parse
	 * @returns { String } el.outerHTML
	 */
	function getOuterHTML(el) {
	  if (el.outerHTML) return el.outerHTML
	  // some browsers do not support outerHTML on the SVGs tags
	  else {
	    var container = mkEl('div')
	    container.appendChild(el.cloneNode(true))
	    return container.innerHTML
	  }
	}

	/**
	 * Set the inner html of any DOM node SVGs included
	 * @param { Object } container - DOM node where we will inject the new html
	 * @param { String } html - html to inject
	 */
	function setInnerHTML(container, html) {
	  if (typeof container.innerHTML != T_UNDEF) container.innerHTML = html
	  // some browsers do not support innerHTML on the SVGs tags
	  else {
	    var doc = new DOMParser().parseFromString(html, 'application/xml')
	    container.appendChild(
	      container.ownerDocument.importNode(doc.documentElement, true)
	    )
	  }
	}

	/**
	 * Checks wether a DOM node must be considered part of an svg document
	 * @param   { String }  name - tag name
	 * @returns { Boolean } -
	 */
	function isSVGTag(name) {
	  return ~SVG_TAGS_LIST.indexOf(name)
	}

	/**
	 * Detect if the argument passed is an object, exclude null.
	 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isObject(v) {
	  return v && typeof v === T_OBJECT         // typeof null is 'object'
	}

	/**
	 * Remove any DOM attribute from a node
	 * @param   { Object } dom - DOM node we want to update
	 * @param   { String } name - name of the property we want to remove
	 */
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}

	/**
	 * Convert a string containing dashes to camel case
	 * @param   { String } string - input string
	 * @returns { String } my-string -> myString
	 */
	function toCamel(string) {
	  return string.replace(/-(\w)/g, function(_, c) {
	    return c.toUpperCase()
	  })
	}

	/**
	 * Get the value of any DOM attribute on a node
	 * @param   { Object } dom - DOM node we want to parse
	 * @param   { String } name - name of the attribute we want to get
	 * @returns { String | undefined } name of the node attribute whether it exists
	 */
	function getAttr(dom, name) {
	  return dom.getAttribute(name)
	}

	/**
	 * Set any DOM/SVG attribute
	 * @param { Object } dom - DOM node we want to update
	 * @param { String } name - name of the property we want to set
	 * @param { String } val - value of the property we want to set
	 */
	function setAttr(dom, name, val) {
	  var xlink = XLINK_REGEX.exec(name)
	  if (xlink && xlink[1])
	    dom.setAttributeNS(XLINK_NS, xlink[1], val)
	  else
	    dom.setAttribute(name, val)
	}

	/**
	 * Detect the tag implementation by a DOM node
	 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
	 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
	 */
	function getTag(dom) {
	  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
	    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	/**
	 * Add a child tag to its parent into the `tags` object
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the new tag will be stored
	 * @param   { Object } parent - tag instance where the new child tag will be included
	 */
	function addChildTag(tag, tagName, parent) {
	  var cachedTag = parent.tags[tagName]

	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      // don't add the same tag twice
	      if (cachedTag !== tag)
	        parent.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!contains(parent.tags[tagName], tag))
	      parent.tags[tagName].push(tag)
	  } else {
	    parent.tags[tagName] = tag
	  }
	}

	/**
	 * Move the position of a custom tag in its parent tag
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the tag was stored
	 * @param   { Number } newPos - index where the new tag will be stored
	 */
	function moveChildTag(tag, tagName, newPos) {
	  var parent = tag.parent,
	    tags
	  // no parent no move
	  if (!parent) return

	  tags = parent.tags[tagName]

	  if (isArray(tags))
	    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
	  else addChildTag(tag, tagName, parent)
	}

	/**
	 * Create a new child tag including it correctly into its parent
	 * @param   { Object } child - child tag implementation
	 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
	 * @param   { String } innerHTML - inner html of the child node
	 * @param   { Object } parent - instance of the parent tag including the child custom tag
	 * @returns { Object } instance of the new child tag just created
	 */
	function initChildTag(child, opts, innerHTML, parent) {
	  var tag = new Tag(child, opts, innerHTML),
	    tagName = getTagName(opts.root),
	    ptag = getImmediateCustomParentTag(parent)
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	  // store the real parent tag
	  // in some cases this could be different from the custom parent tag
	  // for example in nested loops
	  tag._parent = parent

	  // add this tag to the custom parent tag
	  addChildTag(tag, tagName, ptag)
	  // and also to the real parent tag
	  if (ptag !== parent)
	    addChildTag(tag, tagName, parent)
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  opts.root.innerHTML = ''

	  return tag
	}

	/**
	 * Loop backward all the parents tree to detect the first custom parent tag
	 * @param   { Object } tag - a Tag instance
	 * @returns { Object } the instance of the first custom parent tag found
	 */
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}

	/**
	 * Helper function to set an immutable property
	 * @param   { Object } el - object where the new property will be set
	 * @param   { String } key - object key where the new property will be stored
	 * @param   { * } value - value of the new property
	* @param   { Object } options - set the propery overriding the default options
	 * @returns { Object } - the initial object
	 */
	function defineProperty(el, key, value, options) {
	  Object.defineProperty(el, key, extend({
	    value: value,
	    enumerable: false,
	    writable: false,
	    configurable: true
	  }, options))
	  return el
	}

	/**
	 * Get the tag name of any DOM node
	 * @param   { Object } dom - DOM node we want to parse
	 * @returns { String } name to identify this dom node in riot
	 */
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = getAttr(dom, 'name'),
	    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
	                namedTag :
	              child ? child.name : dom.tagName.toLowerCase()

	  return tagName
	}

	/**
	 * Extend any object with other properties
	 * @param   { Object } src - source object
	 * @returns { Object } the resulting extended object
	 *
	 * var obj = { foo: 'baz' }
	 * extend(obj, {bar: 'bar', foo: 'bar'})
	 * console.log(obj) => {bar: 'bar', foo: 'bar'}
	 *
	 */
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if (obj = args[i]) {
	      for (var key in obj) {
	        // check if this property of the source object could be overridden
	        if (isWritable(src, key))
	          src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}

	/**
	 * Check whether an array contains an item
	 * @param   { Array } arr - target array
	 * @param   { * } item - item to test
	 * @returns { Boolean } Does 'arr' contain 'item'?
	 */
	function contains(arr, item) {
	  return ~arr.indexOf(item)
	}

	/**
	 * Check whether an object is a kind of array
	 * @param   { * } a - anything
	 * @returns {Boolean} is 'a' an array?
	 */
	function isArray(a) { return Array.isArray(a) || a instanceof Array }

	/**
	 * Detect whether a property of an object could be overridden
	 * @param   { Object }  obj - source object
	 * @param   { String }  key - object property
	 * @returns { Boolean } is this property writable?
	 */
	function isWritable(obj, key) {
	  var props = Object.getOwnPropertyDescriptor(obj, key)
	  return typeof obj[key] === T_UNDEF || props && props.writable
	}


	/**
	 * With this function we avoid that the internal Tag methods get overridden
	 * @param   { Object } data - options we want to use to extend the tag instance
	 * @returns { Object } clean object without containing the riot internal reserved words
	 */
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
	    return data

	  var o = {}
	  for (var key in data) {
	    if (!RESERVED_WORDS_BLACKLIST.test(key)) o[key] = data[key]
	  }
	  return o
	}

	/**
	 * Walk down recursively all the children tags starting dom node
	 * @param   { Object }   dom - starting node where we will start the recursion
	 * @param   { Function } fn - callback to transform the child node just found
	 */
	function walk(dom, fn) {
	  if (dom) {
	    // stop the recursion
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild

	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}

	/**
	 * Minimize risk: only zero or one _space_ between attr & value
	 * @param   { String }   html - html string we want to parse
	 * @param   { Function } fn - callback function to apply on any attribute found
	 */
	function walkAttributes(html, fn) {
	  var m,
	    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

	  while (m = re.exec(html)) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}

	/**
	 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
	 * @param   { Object }  dom - DOM node we want to parse
	 * @returns { Boolean } -
	 */
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}

	/**
	 * Create a generic DOM node
	 * @param   { String } name - name of the DOM node we want to create
	 * @param   { Boolean } isSvg - should we use a SVG as parent node?
	 * @returns { Object } DOM node just created
	 */
	function mkEl(name, isSvg) {
	  return isSvg ?
	    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
	    document.createElement(name)
	}

	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}

	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}

	/**
	 * Simple object prototypal inheritance
	 * @param   { Object } parent - parent object
	 * @returns { Object } child instance
	 */
	function inherit(parent) {
	  return Object.create(parent || null)
	}

	/**
	 * Get the name property needed to identify a DOM node in riot
	 * @param   { Object } dom - DOM node we need to parse
	 * @returns { String | undefined } give us back a string to identify this dom node
	 */
	function getNamedKey(dom) {
	  return getAttr(dom, 'id') || getAttr(dom, 'name')
	}

	/**
	 * Set the named properties of a tag element
	 * @param { Object } dom - DOM node we need to parse
	 * @param { Object } parent - tag instance where the named dom element will be eventually added
	 * @param { Array } keys - list of all the tag instance properties
	 */
	function setNamed(dom, parent, keys) {
	  // get the key value we want to add to the tag instance
	  var key = getNamedKey(dom),
	    isArr,
	    // add the node detected to a tag instance using the named property
	    add = function(value) {
	      // avoid to override the tag properties already set
	      if (contains(keys, key)) return
	      // check whether this value is an array
	      isArr = isArray(value)
	      // if the key was never set
	      if (!value)
	        // set it once on the tag instance
	        parent[key] = dom
	      // if it was an array and not yet set
	      else if (!isArr || isArr && !contains(value, dom)) {
	        // add the dom node into the array
	        if (isArr)
	          value.push(dom)
	        else
	          parent[key] = [value, dom]
	      }
	    }

	  // skip the elements with no named properties
	  if (!key) return

	  // check whether this key has been already evaluated
	  if (tmpl.hasExpr(key))
	    // wait the first updated event only once
	    parent.one('mount', function() {
	      key = getNamedKey(dom)
	      add(parent[key])
	    })
	  else
	    add(parent[key])

	}

	/**
	 * Faster String startsWith alternative
	 * @param   { String } src - source string
	 * @param   { String } str - test string
	 * @returns { Boolean } -
	 */
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}

	/**
	 * requestAnimationFrame function
	 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
	 */
	var rAF = (function (w) {
	  var raf = w.requestAnimationFrame    ||
	            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame

	  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
	    var lastTime = 0

	    raf = function (cb) {
	      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
	      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
	    }
	  }
	  return raf

	})(window || {})

	/**
	 * Mount a tag creating new Tag instance
	 * @param   { Object } root - dom node where the tag will be mounted
	 * @param   { String } tagName - name of the riot tag we want to mount
	 * @param   { Object } opts - options to pass to the Tag instance
	 * @returns { Tag } a new Tag instance
	 */
	function mountTo(root, tagName, opts) {
	  var tag = __tagImpl[tagName],
	    // cache the inner HTML to fix #855
	    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

	  // clear the inner html
	  root.innerHTML = ''

	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

	  if (tag && tag.mount) {
	    tag.mount()
	    // add this tag to the virtualDom variable
	    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
	  }

	  return tag
	}
	/**
	 * Riot public api
	 */

	// share methods for other riot parts, e.g. compiler
	riot.util = { brackets: brackets, tmpl: tmpl }

	/**
	 * Create a mixin that could be globally shared across all the tags
	 */
	riot.mixin = (function() {
	  var mixins = {},
	    globals = mixins[GLOBAL_MIXIN] = {},
	    _id = 0

	  /**
	   * Create/Return a mixin by its name
	   * @param   { String }  name - mixin name (global mixin if object)
	   * @param   { Object }  mixin - mixin logic
	   * @param   { Boolean } g - is global?
	   * @returns { Object }  the mixin logic
	   */
	  return function(name, mixin, g) {
	    // Unnamed global
	    if (isObject(name)) {
	      riot.mixin('__unnamed_'+_id++, name, true)
	      return
	    }

	    var store = g ? globals : mixins

	    // Getter
	    if (!mixin) {
	      if (typeof store[name] === T_UNDEF) {
	        throw new Error('Unregistered mixin: ' + name)
	      }
	      return store[name]
	    }
	    // Setter
	    if (isFunction(mixin)) {
	      extend(mixin.prototype, store[name] || {})
	      store[name] = mixin
	    }
	    else {
	      store[name] = extend(store[name] || {}, mixin)
	    }
	  }

	})()

	/**
	 * Create a new riot tag implementation
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else styleManager.add(css)
	  }
	  name = name.toLowerCase()
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	/**
	 * Create a new riot tag implementation (for use by the compiler)
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag2 = function(name, html, css, attrs, fn) {
	  if (css) styleManager.add(css)
	  //if (bpair) riot.settings.brackets = bpair
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	/**
	 * Mount a tag using a specific tag implementation
	 * @param   { String } selector - tag DOM selector
	 * @param   { String } tagName - tag implementation name
	 * @param   { Object } opts - tag logic
	 * @returns { Array } new tags instances
	 */
	riot.mount = function(selector, tagName, opts) {

	  var els,
	    allTags,
	    tags = []

	  // helper functions

	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      if (!/[^-\w]/.test(e)) {
	        e = e.trim().toLowerCase()
	        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
	      }
	    })
	    return list
	  }

	  function selectAllTags() {
	    var keys = Object.keys(__tagImpl)
	    return keys + addRiotTags(keys)
	  }

	  function pushTags(root) {
	    if (root.tagName) {
	      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)

	      // have tagName? force riot-tag to be the same
	      if (tagName && riotTag !== tagName) {
	        riotTag = tagName
	        setAttr(root, RIOT_TAG_IS, tagName)
	        setAttr(root, RIOT_TAG, tagName) // this will be removed in riot 3.0.0
	      }
	      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)

	      if (tag) tags.push(tag)
	    } else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }

	  // ----- mount code -----

	  // inject styles into DOM
	  styleManager.inject()

	  if (isObject(tagName)) {
	    opts = tagName
	    tagName = 0
	  }

	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(/, */))

	    // make sure to pass always a selector
	    // to the querySelectorAll function
	    els = selector ? $$(selector) : []
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector

	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }

	  pushTags(els)

	  return tags
	}

	/**
	 * Update all the tags instances created
	 * @returns { Array } all the tags instances
	 */
	riot.update = function() {
	  return each(__virtualDom, function(tag) {
	    tag.update()
	  })
	}

	/**
	 * Export the Virtual DOM
	 */
	riot.vdom = __virtualDom

	/**
	 * Export the Tag constructor
	 */
	riot.Tag = Tag
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if ("function" === T_FUNCTION && typeof __webpack_require__(4) !== T_UNDEF)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return riot }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot

	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/* Copyright (c) 2013-2017 Six Apart, Ltd.
	 * This file is generated by Movable Type DataAPI SDK for JavaScript.
	 * Consult the source files for their respective licenses and copyrights.
	 * https://github.com/movabletype/mt-data-api-sdk-js
	 */

	!function (a, b) {
	  var c = b(a);"object" == ( false ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports) ? module.exports = c : "function" == "function" && __webpack_require__(4) && !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return c;
	  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}("undefined" == typeof window ? void 0 : window, function (window, undefined) {
	  "use strict";
	  var DataAPI = function DataAPI(a) {
	    var b,
	        c,
	        d = ["clientId", "baseUrl"];this.o = { clientId: undefined, baseUrl: undefined, format: undefined, sessionStore: undefined, sessionDomain: undefined, sessionPath: undefined, async: !0, timeout: undefined, cache: !0, withoutAuthorization: !1, processOneTimeTokenOnInitialize: !0, loadPluginEndpoints: !0, suppressResponseCodes: undefined, crossOrigin: undefined, disableFormData: !1 };for (c in a) {
	      if (!(c in this.o)) throw "Unkown option: " + c;this.o[c] = a[c];
	    }for (b = 0; b < d.length; b++) {
	      if (!this.o[d[b]]) throw 'The "' + d[b] + '" is required.';
	    }this.callbacks = {}, this.tokenData = null, this.iframeId = 0, this._initOptions(), this.o.loadPluginEndpoints && this.loadEndpoints({ excludeComponents: "core" }), this.o.processOneTimeTokenOnInitialize && this._storeOneTimeToken(), this.trigger("initialize");
	  };DataAPI.version = 3, DataAPI.accessTokenKey = "mt_data_api_access_token", DataAPI.iframePrefix = "mt_data_api_iframe_", DataAPI.defaultFormat = "json", DataAPI.defaultSessionStore = window.document ? "cookie-encrypted" : "fs", DataAPI.callbacks = {}, DataAPI.formats = { json: { fileExtension: "json", mimeType: "application/json", serialize: function serialize() {
	        return JSON.stringify.apply(JSON, arguments);
	      }, unserialize: function unserialize() {
	        return JSON.parse.apply(JSON, arguments);
	      } } }, DataAPI.sessionStores = {}, function () {
	    function a(a) {
	      var b = Cookie.fetch(a);if (!b) return {};try {
	        return JSON.parse(b.value);
	      } catch (c) {
	        return { data: b.value };
	      }
	    }function b(a, b) {
	      var e = a.path,
	          f = d(c());return (!e || e.length > f.length) && (e = f), { data: a.data, domain: ("undefined" == typeof b ? undefined : b.sessionDomain) || a.domain || undefined, path: ("undefined" == typeof b ? undefined : b.sessionPath) || e };
	    }function c() {
	      if (!window.location) return "";var a;try {
	        a = window.location.href;
	      } catch (b) {
	        a = window.document.createElement("a"), a.href = "", a = a.href;
	      }return a;
	    }function d(a) {
	      var b = /^[\w.+-]+:(?:\/\/[^\/?#:]*(?::\d+|)|)(.*)\/[^\/]*$/,
	          c = b.exec(a.toLowerCase());return c ? c[1] : null;
	    }DataAPI.sessionStores.cookie = { save: function save(c, d, e) {
	        var f = e ? new Date(new Date().getTime() + 31536e7) : undefined,
	            g = b(a(c), this.o);Cookie.bake(c, JSON.stringify(g), g.domain, g.path, f);
	      }, fetch: function fetch(b) {
	        a(b).data;
	      }, remove: function remove(c) {
	        var d = b(a(c));Cookie.bake(c, "", d.domain, d.path, new Date(0));
	      } };
	  }(), function () {
	    var a = { cipher: {}, hash: {}, mode: {}, misc: {}, codec: {}, exception: { corrupt: function corrupt(a) {
	          this.toString = function () {
	            return "CORRUPT: " + this.message;
	          }, this.message = a;
	        }, invalid: function invalid(a) {
	          this.toString = function () {
	            return "INVALID: " + this.message;
	          }, this.message = a;
	        }, bug: function bug(a) {
	          this.toString = function () {
	            return "BUG: " + this.message;
	          }, this.message = a;
	        }, notReady: function notReady(a) {
	          this.toString = function () {
	            return "NOT READY: " + this.message;
	          }, this.message = a;
	        } } };a.cipher.aes = function (b) {
	      this._tables[0][0][0] || this._precompute();var c,
	          d,
	          e,
	          f,
	          g,
	          h = this._tables[0][4],
	          i = this._tables[1],
	          j = b.length,
	          k = 1;if (4 !== j && 6 !== j && 8 !== j) throw new a.exception.invalid("invalid aes key size");for (this._key = [f = b.slice(0), g = []], c = j; 4 * j + 28 > c; c++) {
	        e = f[c - 1], (c % j === 0 || 8 === j && c % j === 4) && (e = h[e >>> 24] << 24 ^ h[e >> 16 & 255] << 16 ^ h[e >> 8 & 255] << 8 ^ h[255 & e], c % j === 0 && (e = e << 8 ^ e >>> 24 ^ k << 24, k = k << 1 ^ 283 * (k >> 7))), f[c] = f[c - j] ^ e;
	      }for (d = 0; c; d++, c--) {
	        e = f[3 & d ? c : c - 4], 4 >= c || 4 > d ? g[d] = e : g[d] = i[0][h[e >>> 24]] ^ i[1][h[e >> 16 & 255]] ^ i[2][h[e >> 8 & 255]] ^ i[3][h[255 & e]];
	      }
	    }, a.cipher.aes.prototype = { encrypt: function encrypt(a) {
	        return this._crypt(a, 0);
	      }, decrypt: function decrypt(a) {
	        return this._crypt(a, 1);
	      }, _tables: [[[], [], [], [], []], [[], [], [], [], []]], _precompute: function _precompute() {
	        var a = this._tables[0],
	            b = this._tables[1],
	            c = a[4],
	            d = b[4],
	            e,
	            f,
	            g,
	            h = [],
	            i = [],
	            j,
	            k,
	            l,
	            m,
	            n,
	            o;for (e = 0; 256 > e; e++) {
	          i[(h[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e;
	        }for (f = g = 0; !c[f]; f ^= j || 1, g = i[g] || 1) {
	          for (m = g ^ g << 1 ^ g << 2 ^ g << 3 ^ g << 4, m = m >> 8 ^ 255 & m ^ 99, c[f] = m, d[m] = f, l = h[k = h[j = h[f]]], o = 16843009 * l ^ 65537 * k ^ 257 * j ^ 16843008 * f, n = 257 * h[m] ^ 16843008 * m, e = 0; 4 > e; e++) {
	            a[e][f] = n = n << 24 ^ n >>> 8, b[e][m] = o = o << 24 ^ o >>> 8;
	          }
	        }for (e = 0; 5 > e; e++) {
	          a[e] = a[e].slice(0), b[e] = b[e].slice(0);
	        }
	      }, _crypt: function _crypt(b, c) {
	        if (4 !== b.length) throw new a.exception.invalid("invalid aes block size");var d = this._key[c],
	            e = b[0] ^ d[0],
	            f = b[c ? 3 : 1] ^ d[1],
	            g = b[2] ^ d[2],
	            h = b[c ? 1 : 3] ^ d[3],
	            i,
	            j,
	            k,
	            l = d.length / 4 - 2,
	            m,
	            n = 4,
	            o = [0, 0, 0, 0],
	            p = this._tables[c],
	            q = p[0],
	            r = p[1],
	            s = p[2],
	            t = p[3],
	            u = p[4];for (m = 0; l > m; m++) {
	          i = q[e >>> 24] ^ r[f >> 16 & 255] ^ s[g >> 8 & 255] ^ t[255 & h] ^ d[n], j = q[f >>> 24] ^ r[g >> 16 & 255] ^ s[h >> 8 & 255] ^ t[255 & e] ^ d[n + 1], k = q[g >>> 24] ^ r[h >> 16 & 255] ^ s[e >> 8 & 255] ^ t[255 & f] ^ d[n + 2], h = q[h >>> 24] ^ r[e >> 16 & 255] ^ s[f >> 8 & 255] ^ t[255 & g] ^ d[n + 3], n += 4, e = i, f = j, g = k;
	        }for (m = 0; 4 > m; m++) {
	          o[c ? 3 & -m : m] = u[e >>> 24] << 24 ^ u[f >> 16 & 255] << 16 ^ u[g >> 8 & 255] << 8 ^ u[255 & h] ^ d[n++], i = e, e = f, f = g, g = h, h = i;
	        }return o;
	      } }, a.bitArray = { bitSlice: function bitSlice(b, c, d) {
	        return b = a.bitArray._shiftRight(b.slice(c / 32), 32 - (31 & c)).slice(1), d === undefined ? b : a.bitArray.clamp(b, d - c);
	      }, concat: function concat(b, c) {
	        if (0 === b.length || 0 === c.length) return b.concat(c);var d,
	            e,
	            f = b[b.length - 1],
	            g = a.bitArray.getPartial(f);return 32 === g ? b.concat(c) : a.bitArray._shiftRight(c, g, 0 | f, b.slice(0, b.length - 1));
	      }, bitLength: function bitLength(b) {
	        var c = b.length,
	            d;if (0 === c) return 0;return d = b[c - 1], 32 * (c - 1) + a.bitArray.getPartial(d);
	      }, clamp: function clamp(b, c) {
	        if (32 * b.length < c) return b;b = b.slice(0, Math.ceil(c / 32));var d = b.length;return c = 31 & c, d > 0 && c && (b[d - 1] = a.bitArray.partial(c, b[d - 1] & 2147483648 >> c - 1, 1)), b;
	      }, partial: function partial(a, b, c) {
	        if (32 === a) return b;return (c ? 0 | b : b << 32 - a) + 1099511627776 * a;
	      }, getPartial: function getPartial(a) {
	        return Math.round(a / 1099511627776) || 32;
	      }, equal: function equal(b, c) {
	        if (a.bitArray.bitLength(b) !== a.bitArray.bitLength(c)) return !1;var d = 0,
	            e;for (e = 0; e < b.length; e++) {
	          d |= b[e] ^ c[e];
	        }return 0 === d;
	      }, _shiftRight: function _shiftRight(b, c, d, e) {
	        var f,
	            g = 0,
	            h;for (e === undefined && (e = []); c >= 32; c -= 32) {
	          e.push(d), d = 0;
	        }if (0 === c) return e.concat(b);for (f = 0; f < b.length; f++) {
	          e.push(d | b[f] >>> c), d = b[f] << 32 - c;
	        }return g = b.length ? b[b.length - 1] : 0, h = a.bitArray.getPartial(g), e.push(a.bitArray.partial(c + h & 31, c + h > 32 ? d : e.pop(), 1)), e;
	      }, _xor4: function _xor4(a, b) {
	        return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]];
	      } }, a.codec.utf8String = { fromBits: function fromBits(b) {
	        var c = "",
	            d = a.bitArray.bitLength(b),
	            e,
	            f;for (e = 0; d / 8 > e; e++) {
	          0 === (3 & e) && (f = b[e / 4]), c += String.fromCharCode(f >>> 24), f <<= 8;
	        }return decodeURIComponent(escape(c));
	      }, toBits: function toBits(b) {
	        b = unescape(encodeURIComponent(b));var c = [],
	            d,
	            e = 0;for (d = 0; d < b.length; d++) {
	          e = e << 8 | b.charCodeAt(d), 3 === (3 & d) && (c.push(e), e = 0);
	        }return 3 & d && c.push(a.bitArray.partial(8 * (3 & d), e)), c;
	      } }, a.codec.base64 = { _chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", fromBits: function fromBits(b, c) {
	        var d = "",
	            e,
	            f = 0,
	            g = a.codec.base64._chars,
	            h = 0,
	            i = a.bitArray.bitLength(b);for (e = 0; 6 * d.length < i;) {
	          d += g.charAt((h ^ b[e] >>> f) >>> 26), 6 > f ? (h = b[e] << 6 - f, f += 26, e++) : (h <<= 6, f -= 6);
	        }while (3 & d.length && !c) {
	          d += "=";
	        }return d;
	      }, toBits: function toBits(b) {
	        b = b.replace(/\s|=/g, "");var c = [],
	            d,
	            e = 0,
	            f = a.codec.base64._chars,
	            g = 0,
	            h;for (d = 0; d < b.length; d++) {
	          if (h = f.indexOf(b.charAt(d)), 0 > h) throw new a.exception.invalid("this isn't base64!");e > 26 ? (e -= 26, c.push(g ^ h >>> e), g = h << 32 - e) : (e += 6, g ^= h << 32 - e);
	        }return 56 & e && c.push(a.bitArray.partial(56 & e, g, 1)), c;
	      } }, a.hash.sha256 = function (a) {
	      this._key[0] || this._precompute(), a ? (this._h = a._h.slice(0), this._buffer = a._buffer.slice(0), this._length = a._length) : this.reset();
	    }, a.hash.sha256.hash = function (b) {
	      return new a.hash.sha256().update(b).finalize();
	    }, a.hash.sha256.prototype = { blockSize: 512, reset: function reset() {
	        return this._h = this._init.slice(0), this._buffer = [], this._length = 0, this;
	      }, update: function update(b) {
	        "string" == typeof b && (b = a.codec.utf8String.toBits(b));var c,
	            d = this._buffer = a.bitArray.concat(this._buffer, b),
	            e = this._length,
	            f = this._length = e + a.bitArray.bitLength(b);for (c = 512 + e & -512; f >= c; c += 512) {
	          this._block(d.splice(0, 16));
	        }return this;
	      }, finalize: function finalize() {
	        var b,
	            c = this._buffer,
	            d = this._h;for (c = a.bitArray.concat(c, [a.bitArray.partial(1, 1)]), b = c.length + 2; 15 & b; b++) {
	          c.push(0);
	        }c.push(Math.floor(this._length / 4294967296)), c.push(0 | this._length);while (c.length) {
	          this._block(c.splice(0, 16));
	        }return this.reset(), d;
	      }, _init: [], _key: [], _precompute: function _precompute() {
	        var a = 0,
	            b = 2,
	            c;function d(a) {
	          return 4294967296 * (a - Math.floor(a)) | 0;
	        }a: for (; 64 > a; b++) {
	          for (c = 2; b >= c * c; c++) {
	            if (b % c === 0) continue a;
	          }8 > a && (this._init[a] = d(Math.pow(b, .5))), this._key[a] = d(Math.pow(b, 1 / 3)), a++;
	        }
	      }, _block: function _block(a) {
	        var b,
	            c,
	            d,
	            e,
	            f = a.slice(0),
	            g = this._h,
	            h = this._key,
	            i = g[0],
	            j = g[1],
	            k = g[2],
	            l = g[3],
	            m = g[4],
	            n = g[5],
	            o = g[6],
	            p = g[7];for (b = 0; 64 > b; b++) {
	          16 > b ? c = f[b] : (d = f[b + 1 & 15], e = f[b + 14 & 15], c = f[15 & b] = (d >>> 7 ^ d >>> 18 ^ d >>> 3 ^ d << 25 ^ d << 14) + (e >>> 17 ^ e >>> 19 ^ e >>> 10 ^ e << 15 ^ e << 13) + f[15 & b] + f[b + 9 & 15] | 0), c = c + p + (m >>> 6 ^ m >>> 11 ^ m >>> 25 ^ m << 26 ^ m << 21 ^ m << 7) + (o ^ m & (n ^ o)) + h[b], p = o, o = n, n = m, m = l + c | 0, l = k, k = j, j = i, i = c + (j & k ^ l & (j ^ k)) + (j >>> 2 ^ j >>> 13 ^ j >>> 22 ^ j << 30 ^ j << 19 ^ j << 10) | 0;
	        }g[0] = g[0] + i | 0, g[1] = g[1] + j | 0, g[2] = g[2] + k | 0, g[3] = g[3] + l | 0, g[4] = g[4] + m | 0, g[5] = g[5] + n | 0, g[6] = g[6] + o | 0, g[7] = g[7] + p | 0;
	      } }, a.mode.ccm = { name: "ccm", encrypt: function encrypt(b, c, d, e, f) {
	        var g,
	            h,
	            i = c.slice(0),
	            j,
	            k = a.bitArray,
	            l = k.bitLength(d) / 8,
	            m = k.bitLength(i) / 8;if (f = f || 64, e = e || [], 7 > l) throw new a.exception.invalid("ccm: iv must be at least 7 bytes");for (g = 2; 4 > g && m >>> 8 * g; g++) {}return 15 - l > g && (g = 15 - l), d = k.clamp(d, 8 * (15 - g)), j = a.mode.ccm._computeTag(b, c, d, e, f, g), i = a.mode.ccm._ctrMode(b, i, d, j, f, g), k.concat(i.data, i.tag);
	      }, decrypt: function decrypt(b, c, d, e, f) {
	        f = f || 64, e = e || [];var g,
	            h,
	            i = a.bitArray,
	            j = i.bitLength(d) / 8,
	            k = i.bitLength(c),
	            l = i.clamp(c, k - f),
	            m = i.bitSlice(c, k - f),
	            n;if (k = (k - f) / 8, 7 > j) throw new a.exception.invalid("ccm: iv must be at least 7 bytes");for (g = 2; 4 > g && k >>> 8 * g; g++) {}if (15 - j > g && (g = 15 - j), d = i.clamp(d, 8 * (15 - g)), l = a.mode.ccm._ctrMode(b, l, d, m, f, g), n = a.mode.ccm._computeTag(b, l.data, d, e, f, g), !i.equal(l.tag, n)) throw new a.exception.corrupt("ccm: tag doesn't match");return l.data;
	      }, _computeTag: function _computeTag(b, c, d, e, f, g) {
	        var h,
	            i,
	            j = 0,
	            k = 24,
	            l,
	            m,
	            n = [],
	            o = a.bitArray,
	            p = o._xor4;if (f /= 8, f % 2 || 4 > f || f > 16) throw new a.exception.invalid("ccm: invalid tag length");if (e.length > 4294967295 || c.length > 4294967295) throw new a.exception.bug("ccm: can't deal with 4GiB or more data");if (i = [o.partial(8, (e.length ? 64 : 0) | f - 2 << 2 | g - 1)], i = o.concat(i, d), i[3] |= o.bitLength(c) / 8, i = b.encrypt(i), e.length) for (l = o.bitLength(e) / 8, 65279 >= l ? n = [o.partial(16, l)] : 4294967295 >= l && (n = o.concat([o.partial(16, 65534)], [l])), n = o.concat(n, e), m = 0; m < n.length; m += 4) {
	          i = b.encrypt(p(i, n.slice(m, m + 4).concat([0, 0, 0])));
	        }for (m = 0; m < c.length; m += 4) {
	          i = b.encrypt(p(i, c.slice(m, m + 4).concat([0, 0, 0])));
	        }return o.clamp(i, 8 * f);
	      }, _ctrMode: function _ctrMode(b, c, d, e, f, g) {
	        var h,
	            i,
	            j = a.bitArray,
	            k = j._xor4,
	            l,
	            m,
	            n = c.length,
	            o = j.bitLength(c);if (l = j.concat([j.partial(8, g - 1)], d).concat([0, 0, 0]).slice(0, 4), e = j.bitSlice(k(e, b.encrypt(l)), 0, f), !n) return { tag: e, data: [] };for (i = 0; n > i; i += 4) {
	          l[3]++, h = b.encrypt(l), c[i] ^= h[0], c[i + 1] ^= h[1], c[i + 2] ^= h[2], c[i + 3] ^= h[3];
	        }return { tag: e, data: j.clamp(c, o) };
	      } }, a.misc.hmac = function (b, c) {
	      this._hash = c = c || a.hash.sha256;var d = [[], []],
	          e,
	          f = c.prototype.blockSize / 32;for (this._baseHash = [new c(), new c()], b.length > f && (b = c.hash(b)), e = 0; f > e; e++) {
	        d[0][e] = 909522486 ^ b[e], d[1][e] = 1549556828 ^ b[e];
	      }this._baseHash[0].update(d[0]), this._baseHash[1].update(d[1]);
	    }, a.misc.hmac.prototype.encrypt = a.misc.hmac.prototype.mac = function (a) {
	      var b = new this._hash(this._baseHash[0]).update(a).finalize();return new this._hash(this._baseHash[1]).update(b).finalize();
	    }, a.misc.pbkdf2 = function (b, c, d, e, f) {
	      if (d = d || 1e3, 0 > e || 0 > d) throw a.exception.invalid("invalid params to pbkdf2");"string" == typeof b && (b = a.codec.utf8String.toBits(b)), f = f || a.misc.hmac;var g = new f(b),
	          h,
	          i,
	          j,
	          k,
	          l,
	          m = [],
	          n = a.bitArray;for (l = 1; 32 * m.length < (e || 1); l++) {
	        for (h = i = g.encrypt(n.concat(c, [l])), j = 1; d > j; j++) {
	          for (i = g.encrypt(i), k = 0; k < i.length; k++) {
	            h[k] ^= i[k];
	          }
	        }m = m.concat(h);
	      }return e && (m = n.clamp(m, e)), m;
	    }, a.random = { randomWords: function randomWords(b, c) {
	        var d = [],
	            e,
	            f = this.isReady(c),
	            g;if (f === this._NOT_READY) throw new a.exception.notReady("generator isn't seeded");for (f & this._REQUIRES_RESEED && this._reseedFromPools(!(f & this._READY)), e = 0; b > e; e += 4) {
	          (e + 1) % this._MAX_WORDS_PER_BURST === 0 && this._gate(), g = this._gen4words(), d.push(g[0], g[1], g[2], g[3]);
	        }return this._gate(), d.slice(0, b);
	      }, setDefaultParanoia: function setDefaultParanoia(a) {
	        this._defaultParanoia = a;
	      }, addEntropy: function addEntropy(b, c, d) {
	        d = d || "user";var e,
	            f,
	            g,
	            h = new Date().valueOf(),
	            i = this._robins[d],
	            j = this.isReady(),
	            k = 0;switch (e = this._collectorIds[d], e === undefined && (e = this._collectorIds[d] = this._collectorIdNext++), i === undefined && (i = this._robins[d] = 0), this._robins[d] = (this._robins[d] + 1) % this._pools.length, typeof b === "undefined" ? "undefined" : _typeof(b)) {case "number":
	            c === undefined && (c = 1), this._pools[i].update([e, this._eventId++, 1, c, h, 1, 0 | b]);break;case "object":
	            var l = Object.prototype.toString.call(b);if ("[object Uint32Array]" === l) {
	              for (g = [], f = 0; f < b.length; f++) {
	                g.push(b[f]);
	              }b = g;
	            } else for ("[object Array]" !== l && (k = 1), f = 0; f < b.length && !k; f++) {
	              "number" != typeof b[f] && (k = 1);
	            }if (!k) {
	              if (c === undefined) for (c = 0, f = 0; f < b.length; f++) {
	                g = b[f];while (g > 0) {
	                  c++, g >>>= 1;
	                }
	              }this._pools[i].update([e, this._eventId++, 2, c, h, b.length].concat(b));
	            }break;case "string":
	            c === undefined && (c = b.length), this._pools[i].update([e, this._eventId++, 3, c, h, b.length]), this._pools[i].update(b);break;default:
	            k = 1;}if (k) throw new a.exception.bug("random: addEntropy only supports number, array of numbers or string");this._poolEntropy[i] += c, this._poolStrength += c, j === this._NOT_READY && (this.isReady() !== this._NOT_READY && this._fireEvent("seeded", Math.max(this._strength, this._poolStrength)), this._fireEvent("progress", this.getProgress()));
	      }, isReady: function isReady(a) {
	        var b = this._PARANOIA_LEVELS[a !== undefined ? a : this._defaultParanoia];return this._strength && this._strength >= b ? this._poolEntropy[0] > this._BITS_PER_RESEED && new Date().valueOf() > this._nextReseed ? this._REQUIRES_RESEED | this._READY : this._READY : this._poolStrength >= b ? this._REQUIRES_RESEED | this._NOT_READY : this._NOT_READY;
	      }, getProgress: function getProgress(a) {
	        var b = this._PARANOIA_LEVELS[a ? a : this._defaultParanoia];return this._strength >= b ? 1 : this._poolStrength > b ? 1 : this._poolStrength / b;
	      }, startCollectors: function startCollectors() {
	        if (this._collectorsStarted) return;if (window.addEventListener) window.addEventListener("load", this._loadTimeCollector, !1), window.addEventListener("mousemove", this._mouseCollector, !1);else {
	          if (!document.attachEvent) throw new a.exception.bug("can't attach event");document.attachEvent("onload", this._loadTimeCollector), document.attachEvent("onmousemove", this._mouseCollector);
	        }this._collectorsStarted = !0;
	      }, stopCollectors: function stopCollectors() {
	        if (!this._collectorsStarted) return;window.removeEventListener ? (window.removeEventListener("load", this._loadTimeCollector, !1), window.removeEventListener("mousemove", this._mouseCollector, !1)) : window.detachEvent && (window.detachEvent("onload", this._loadTimeCollector), window.detachEvent("onmousemove", this._mouseCollector)), this._collectorsStarted = !1;
	      }, addEventListener: function addEventListener(a, b) {
	        this._callbacks[a][this._callbackI++] = b;
	      }, removeEventListener: function removeEventListener(a, b) {
	        var c,
	            d,
	            e = this._callbacks[a],
	            f = [];for (d in e) {
	          e.hasOwnProperty(d) && e[d] === b && f.push(d);
	        }for (c = 0; c < f.length; c++) {
	          d = f[c], delete e[d];
	        }
	      }, _pools: [new a.hash.sha256()], _poolEntropy: [0], _reseedCount: 0, _robins: {}, _eventId: 0, _collectorIds: {}, _collectorIdNext: 0, _strength: 0, _poolStrength: 0, _nextReseed: 0, _key: [0, 0, 0, 0, 0, 0, 0, 0], _counter: [0, 0, 0, 0], _cipher: undefined, _defaultParanoia: 6, _collectorsStarted: !1, _callbacks: { progress: {}, seeded: {} }, _callbackI: 0, _NOT_READY: 0, _READY: 1, _REQUIRES_RESEED: 2, _MAX_WORDS_PER_BURST: 65536, _PARANOIA_LEVELS: [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024], _MILLISECONDS_PER_RESEED: 3e4, _BITS_PER_RESEED: 80, _gen4words: function _gen4words() {
	        for (var a = 0; 4 > a; a++) {
	          if (this._counter[a] = this._counter[a] + 1 | 0, this._counter[a]) break;
	        }return this._cipher.encrypt(this._counter);
	      }, _gate: function _gate() {
	        this._key = this._gen4words().concat(this._gen4words()), this._cipher = new a.cipher.aes(this._key);
	      }, _reseed: function _reseed(b) {
	        this._key = a.hash.sha256.hash(this._key.concat(b)), this._cipher = new a.cipher.aes(this._key);for (var c = 0; 4 > c; c++) {
	          if (this._counter[c] = this._counter[c] + 1 | 0, this._counter[c]) break;
	        }
	      }, _reseedFromPools: function _reseedFromPools(b) {
	        var c = [],
	            d = 0,
	            e;for (this._nextReseed = c[0] = new Date().valueOf() + this._MILLISECONDS_PER_RESEED, e = 0; 16 > e; e++) {
	          c.push(4294967296 * Math.random() | 0);
	        }for (e = 0; e < this._pools.length; e++) {
	          if (c = c.concat(this._pools[e].finalize()), d += this._poolEntropy[e], this._poolEntropy[e] = 0, !b && this._reseedCount & 1 << e) break;
	        }this._reseedCount >= 1 << this._pools.length && (this._pools.push(new a.hash.sha256()), this._poolEntropy.push(0)), this._poolStrength -= d, d > this._strength && (this._strength = d), this._reseedCount++, this._reseed(c);
	      }, _mouseCollector: function _mouseCollector(b) {
	        var c = b.x || b.clientX || b.offsetX || 0,
	            d = b.y || b.clientY || b.offsetY || 0;a.random.addEntropy([c, d], 2, "mouse");
	      }, _loadTimeCollector: function _loadTimeCollector(b) {
	        a.random.addEntropy(new Date().valueOf(), 2, "loadtime");
	      }, _fireEvent: function _fireEvent(b, c) {
	        var d,
	            e = a.random._callbacks[b],
	            f = [];for (d in e) {
	          e.hasOwnProperty(d) && f.push(e[d]);
	        }for (d = 0; d < f.length; d++) {
	          f[d](c);
	        }
	      } }, function () {
	      try {
	        var b = new Uint32Array(32);crypto.getRandomValues(b), a.random.addEntropy(b, 1024, "crypto.getRandomValues");
	      } catch (c) {}
	    }(), a.json = { defaults: { v: 1, iter: 1e3, ks: 128, ts: 64, mode: "ccm", adata: "", cipher: "aes" }, encrypt: function encrypt(b, c, d, e) {
	        d = d || {}, e = e || {};var f = a.json,
	            g = f._add({ iv: a.random.randomWords(4, 0) }, f.defaults),
	            h,
	            i,
	            j;if (f._add(g, d), j = g.adata, "string" == typeof g.salt && (g.salt = a.codec.base64.toBits(g.salt)), "string" == typeof g.iv && (g.iv = a.codec.base64.toBits(g.iv)), !a.mode[g.mode] || !a.cipher[g.cipher] || "string" == typeof b && g.iter <= 100 || 64 !== g.ts && 96 !== g.ts && 128 !== g.ts || 128 !== g.ks && 192 !== g.ks && 256 !== g.ks || g.iv.length < 2 || g.iv.length > 4) throw new a.exception.invalid("json encrypt: invalid parameters");return "string" == typeof b && (h = a.misc.cachedPbkdf2(b, g), b = h.key.slice(0, g.ks / 32), g.salt = h.salt), "string" == typeof c && (c = a.codec.utf8String.toBits(c)), "string" == typeof j && (j = a.codec.utf8String.toBits(j)), i = new a.cipher[g.cipher](b), f._add(e, g), e.key = b, g.ct = a.mode[g.mode].encrypt(i, c, g.iv, j, g.ts), f.encode(g);
	      }, decrypt: function decrypt(b, c, d, e) {
	        d = d || {}, e = e || {};var f = a.json,
	            g = f._add(f._add(f._add({}, f.defaults), f.decode(c)), d, !0),
	            h,
	            i,
	            j,
	            k = g.adata;if ("string" == typeof g.salt && (g.salt = a.codec.base64.toBits(g.salt)), "string" == typeof g.iv && (g.iv = a.codec.base64.toBits(g.iv)), !a.mode[g.mode] || !a.cipher[g.cipher] || "string" == typeof b && g.iter <= 100 || 64 !== g.ts && 96 !== g.ts && 128 !== g.ts || 128 !== g.ks && 192 !== g.ks && 256 !== g.ks || !g.iv || g.iv.length < 2 || g.iv.length > 4) throw new a.exception.invalid("json decrypt: invalid parameters");return "string" == typeof b && (i = a.misc.cachedPbkdf2(b, g), b = i.key.slice(0, g.ks / 32), g.salt = i.salt), "string" == typeof k && (k = a.codec.utf8String.toBits(k)), j = new a.cipher[g.cipher](b), h = a.mode[g.mode].decrypt(j, g.ct, g.iv, k, g.ts), f._add(e, g), e.key = b, a.codec.utf8String.fromBits(h);
	      }, encode: function encode(b) {
	        var c,
	            d = "{",
	            e = "";for (c in b) {
	          if (b.hasOwnProperty(c)) {
	            if (!c.match(/^[a-z0-9]+$/i)) throw new a.exception.invalid("json encode: invalid property name");switch (d += e + '"' + c + '":', e = ",", _typeof(b[c])) {case "number":case "boolean":
	                d += b[c];break;case "string":
	                d += '"' + escape(b[c]) + '"';break;case "object":
	                d += '"' + a.codec.base64.fromBits(b[c], 1) + '"';break;default:
	                throw new a.exception.bug("json encode: unsupported type");}
	          }
	        }return d + "}";
	      }, decode: function decode(b) {
	        if (b = b.replace(/\s/g, ""), !b.match(/^\{.*\}$/)) throw new a.exception.invalid("json decode: this isn't json!");var c = b.replace(/^\{|\}$/g, "").split(/,/),
	            d = {},
	            e,
	            f;for (e = 0; e < c.length; e++) {
	          if (!(f = c[e].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i))) throw new a.exception.invalid("json decode: this isn't json!");f[3] ? d[f[2]] = parseInt(f[3], 10) : d[f[2]] = f[2].match(/^(ct|salt|iv)$/) ? a.codec.base64.toBits(f[4]) : unescape(f[4]);
	        }return d;
	      }, _add: function _add(b, c, d) {
	        if (b === undefined && (b = {}), c === undefined) return b;var e;for (e in c) {
	          if (c.hasOwnProperty(e)) {
	            if (d && b[e] !== undefined && b[e] !== c[e]) throw new a.exception.invalid("required parameter overridden");b[e] = c[e];
	          }
	        }return b;
	      }, _filter: function _filter(a, b) {
	        var c = {},
	            d;for (d = 0; d < b.length; d++) {
	          a[b[d]] !== undefined && (c[b[d]] = a[b[d]]);
	        }return c;
	      } }, a.encrypt = a.json.encrypt, a.decrypt = a.json.decrypt, a.misc._pbkdf2Cache = {}, a.misc.cachedPbkdf2 = function (b, c) {
	      var d = a.misc._pbkdf2Cache,
	          e,
	          f,
	          g,
	          h,
	          i;return c = c || {}, i = c.iter || 1e3, f = d[b] = d[b] || {}, e = f[i] = f[i] || { firstSalt: c.salt && c.salt.length ? c.salt.slice(0) : a.random.randomWords(2, 0) }, h = c.salt === undefined ? e.firstSalt : c.salt, e[h] = e[h] || a.misc.pbkdf2(b, h, c.iter), { key: e[h].slice(0), salt: h.slice(0) };
	    };var b = window.localStorage;function c(a) {
	      if (!window.location) return a;var b = window.location.port || ("https:" === window.location.protocol ? 443 : 80);return a + "_" + b;
	    }function d(a) {
	      var b = Cookie.fetch(c(a));if (!b) return {};try {
	        return JSON.parse(b.value);
	      } catch (d) {
	        return { encryptKey: b.value };
	      }
	    }function e(b, c) {
	      function d() {
	        return a.codec.base64.fromBits(a.random.randomWords(8, 0));
	      }var e = b.path,
	          h = g(f());return (!e || e.length > h.length) && (e = h), { encryptKey: b.encryptKey || d(), storageKey: b.storageKey || d(), domain: c.sessionDomain || b.domain || undefined, path: c.sessionPath || e };
	    }function f() {
	      if (!window.location) return "";var a;try {
	        a = window.location.href;
	      } catch (b) {
	        a = window.document.createElement("a"), a.href = "", a = a.href;
	      }return a;
	    }function g(a) {
	      var b = /^[\w.+-]+:(?:\/\/[^\/?#:]*(?::\d+|)|)(.*)\/[^\/]*$/,
	          c = b.exec(a.toLowerCase());return c ? c[1] : null;
	    }function h(a, b) {
	      function c(b) {
	        return a + ":" + b;
	      }var d = [];if (!b) return [a];while (!0) {
	        if (d.push(c(b)), "/" === b) break;b = b.replace(/[^\/]+\/$/, "");
	      }return d;
	    }function i(a, b) {
	      return h(a, b.sessionPath || g(f()) + "/");
	    }b ? DataAPI.sessionStores["cookie-encrypted"] = { save: function save(f, g, h) {
	        var i = h ? new Date(new Date().getTime() + 31536e7) : undefined,
	            j = e(d(f), this.o);Cookie.bake(c(f), JSON.stringify(j), j.domain, j.path, i), b.setItem(j.storageKey, a.encrypt(j.encryptKey, g));
	      }, fetch: function fetch(c) {
	        var e = d(c),
	            f,
	            g,
	            h;if (!e.storageKey) for (g = i(c, this.o), f = 0; f < g.length; f++) {
	          if (b.getItem(g[f])) {
	            e.storageKey = g[f];break;
	          }
	        }h = b.getItem(e.storageKey);try {
	          return a.decrypt(e.encryptKey, h);
	        } catch (j) {}return null;
	      }, remove: function remove(a) {
	        var f = e(d(a), this.o);Cookie.bake(c(a), "", f.domain, f.path, new Date(0)), f.storageKey && b.removeItem(f.storageKey);
	      } } : DataAPI.sessionStores["cookie-encrypted"] = { save: function save() {}, fetch: function fetch() {}, remove: function remove() {} };
	  }(), DataAPI.on = function (a, b) {
	    this.callbacks[a] || (this.callbacks[a] = []), this.callbacks[a].push(b);
	  }, DataAPI.off = function (a, b) {
	    var c, d;if (b) {
	      for (d = this.callbacks[a] || [], c = 0; c < d.length; c++) {
	        if (d[c] === b) {
	          d.splice(c, 1);break;
	        }
	      }
	    } else delete this.callbacks[a];
	  }, DataAPI.registerFormat = function (a, b) {
	    this.formats[a] = b;
	  }, DataAPI.registerSessionStore = function (a, b) {
	    this.sessionStores[a] = b;
	  }, DataAPI.getDefaultFormat = function () {
	    return this.formats[this.defaultFormat];
	  }, DataAPI.getDefaultSessionStore = function () {
	    return this.sessionStores[this.defaultSessionStore];
	  }, DataAPI.prototype = { constructor: DataAPI.prototype.constructor, _initOptions: function _initOptions() {
	      this._initCrossDomainOption();
	    }, _initCrossDomainOption: function _initCrossDomainOption() {
	      var a,
	          b,
	          c,
	          d,
	          e = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;if (window.document && "undefined" == typeof this.o.crossOrigin) {
	        try {
	          a = window.location.href;
	        } catch (f) {
	          a = window.document.createElement("a"), a.href = "", a = a.href;
	        }b = e.exec(a.toLowerCase()) || [], c = this.o.baseUrl.replace(/^\/\//, b[1]).toLowerCase(), d = e.exec(c), this.o.crossOrigin = !(!d || d[1] === b[1] && d[2] === b[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (b[3] || ("http:" === b[1] ? "80" : "443")));
	      }
	    }, getAuthorizationUrl: function getAuthorizationUrl(a) {
	      return this.o.baseUrl.replace(/\/*$/, "/") + "v" + this.getVersion() + "/authorization?clientId=" + this.o.clientId + "&redirectUrl=" + a;
	    }, _getCurrentEpoch: function _getCurrentEpoch() {
	      return Math.round(new Date().getTime() / 1e3);
	    }, _getNextIframeName: function _getNextIframeName() {
	      return this.constructor.iframePrefix + ++this.iframeId;
	    }, getVersion: function getVersion() {
	      return this.constructor.version;
	    }, getAppKey: function getAppKey() {
	      return this.constructor.accessTokenKey + "_" + this.o.clientId;
	    }, _findFormatInternal: function _findFormatInternal(a) {
	      if (!a) return null;for (var b in this.constructor.formats) {
	        if (this.constructor.formats[b].mimeType === a) return this.constructor.formats[b];
	      }return null;
	    }, findFormat: function findFormat(a) {
	      var b = this._findFormatInternal(a);return !b && a.indexOf(";") && (b = this._findFormatInternal(a.replace(/\s*;.*/, ""))), b;
	    }, getCurrentFormat: function getCurrentFormat() {
	      return this.constructor.formats[this.o.format] || this.constructor.getDefaultFormat();
	    }, serializeData: function serializeData() {
	      return this.getCurrentFormat().serialize.apply(this, arguments);
	    }, unserializeData: function unserializeData() {
	      return this.getCurrentFormat().unserialize.apply(this, arguments);
	    }, getCurrentSessionStore: function getCurrentSessionStore() {
	      return this.constructor.sessionStores[this.o.sessionStore] || this.constructor.getDefaultSessionStore();
	    }, saveSessionData: function saveSessionData() {
	      return this.getCurrentSessionStore().save.apply(this, arguments);
	    }, fetchSessionData: function fetchSessionData() {
	      return this.getCurrentSessionStore().fetch.apply(this, arguments);
	    }, removeSessionData: function removeSessionData() {
	      return this.getCurrentSessionStore().remove.apply(this, arguments);
	    }, storeTokenData: function storeTokenData(a) {
	      var b = this.getTokenData();!a.sessionId && b && b.sessionId && (a.sessionId = b.sessionId), a.startTime = this._getCurrentEpoch(), this.saveSessionData(this.getAppKey(), this.serializeData(a), a.sessionId && a.remember), this.tokenData = a;
	    }, clearTokenData: function clearTokenData() {
	      this.removeSessionData(this.getAppKey()), this.tokenData = null;
	    }, _updateTokenFromDefaultCookie: function _updateTokenFromDefaultCookie() {
	      var a = this.constructor.accessTokenKey,
	          b = Cookie.fetch(a),
	          c;if (!b) return null;Cookie.bake(a, "", undefined, "/", new Date(0));try {
	        c = this.unserializeData(b.value);
	      } catch (d) {
	        return null;
	      }return this.storeTokenData(c), c;
	    }, _hasOneTimeToken: function _hasOneTimeToken() {
	      return window.location && 0 === window.location.hash.indexOf("#_ott_");
	    }, _storeOneTimeToken: function _storeOneTimeToken() {
	      var a, b;if (!window.location) return undefined;if (b = window.location.hash.match(/^#_ott_(.*)/), !b) return undefined;return a = { oneTimeToken: b[1] }, window.location.hash = "#_login", this.storeTokenData(a), a;
	    }, getTokenData: function getTokenData() {
	      var a = this.tokenData;if (!a) {
	        if (window.location) if ("#_login" === window.location.hash) try {
	          a = this._updateTokenFromDefaultCookie();
	        } catch (b) {} else this._hasOneTimeToken() && (a = this._storeOneTimeToken());if (!a) try {
	          a = this.unserializeData(this.fetchSessionData(this.getAppKey()));
	        } catch (b) {}
	      }return a && "startTime" in a && "expiresIn" in a && a.startTime + a.expiresIn < this._getCurrentEpoch() && (delete a.accessToken, delete a.startTime, delete a.expiresIn), this.tokenData = a || null;
	    }, getAuthorizationHeader: function getAuthorizationHeader(a) {
	      var b = this.getTokenData();if (b) return "MTAuth " + a + "=" + (b[a] || "");return "";
	    }, bindEndpointParams: function bindEndpointParams(a, b) {
	      var c, d;for (c in b) {
	        d = b[c], "object" == (typeof d === "undefined" ? "undefined" : _typeof(d)) && (d = "function" == typeof d.id ? d.id() : d.id), "function" == typeof d && (d = d()), a = a.replace(new RegExp(":" + c), d);
	      }return a;
	    }, _isElement: function _isElement(a, b) {
	      if (!a || "object" != (typeof a === "undefined" ? "undefined" : _typeof(a))) return !1;var c = a.nodeName;return c && c.toLowerCase() === b;
	    }, _isFormElement: function _isFormElement(a) {
	      return this._isElement(a, "form");
	    }, _isInputElement: function _isInputElement(a) {
	      return this._isElement(a, "input");
	    }, _isFileInputElement: function _isFileInputElement(a) {
	      return this._isInputElement(a) && "file" === a.type.toLowerCase();
	    }, _serializeObject: function _serializeObject(a) {
	      function b(a) {
	        return 10 > a ? "0" + a : a;
	      }function c(a) {
	        if (!isFinite(a.valueOf())) return "";var c,
	            d = a.getTimezoneOffset();return 0 === d ? c = "Z" : (c = d > 0 ? "-" : "+", d = Math.abs(d), c += b(Math.floor(d / 60)) + ":" + b(d % 60)), a.getFullYear() + "-" + b(a.getMonth() + 1) + "-" + b(a.getDate()) + "T" + b(a.getHours()) + ":" + b(a.getMinutes()) + ":" + b(a.getSeconds()) + c;
	      }this._isFormElement(a) && (a = this._serializeFormElementToObject(a));var d = typeof a === "undefined" ? "undefined" : _typeof(a);return "undefined" === d || null === a || "number" === d && !isFinite(a) ? "" : "boolean" === d ? a ? "1" : "" : a instanceof Date ? c(a) : window.File && a instanceof window.File ? a : this._isFileInputElement(a) ? a.files[0] : "object" === d ? this.serializeData(a, function (a, b) {
	        if (this[a] instanceof Date) return c(this[a]);return b;
	      }) : a;
	    }, _serializeParams: function _serializeParams(a) {
	      if (!a) return a;if ("string" == typeof a) return a;this._isFormElement(a) && (a = this._serializeFormElementToObject(a));var b,
	          c = "";for (b in a) {
	        if (!a.hasOwnProperty(b)) continue;c && (c += "&"), c += encodeURIComponent(b) + "=" + encodeURIComponent(this._serializeObject(a[b]));
	      }return c;
	    }, _unserializeParams: function _unserializeParams(a) {
	      if ("string" != typeof a) return a;var b,
	          c,
	          d = {},
	          e = a.split("&");for (b = 0; b < e.length; b++) {
	        c = e[b].split("="), d[decodeURIComponent(c[0])] = decodeURIComponent(c[1]);
	      }return d;
	    }, _newXMLHttpRequestStandard: function _newXMLHttpRequestStandard() {
	      try {
	        return new window.XMLHttpRequest();
	      } catch (a) {}
	    }, _newXMLHttpRequestActiveX: function _newXMLHttpRequestActiveX() {
	      try {
	        return new window.ActiveXObject("Microsoft.XMLHTTP");
	      } catch (a) {}
	    }, newXMLHttpRequest: function newXMLHttpRequest() {
	      return this._newXMLHttpRequestStandard() || this._newXMLHttpRequestActiveX() || !1;
	    }, _findFileInput: function _findFileInput(a) {
	      if ("object" != (typeof a === "undefined" ? "undefined" : _typeof(a))) return null;for (var b in a) {
	        if (this._isFileInputElement(a[b])) return a[b];
	      }return null;
	    }, _isEmptyObject: function _isEmptyObject(a) {
	      if (!a) return !0;for (var b in a) {
	        if (a.hasOwnProperty(b)) return !1;
	      }return !0;
	    }, sendXMLHttpRequest: function sendXMLHttpRequest(a, b, c, d, e) {
	      var f, g, h;a.open(b, c, this.o.async);for (f in e) {
	        a.setRequestHeader(f, e[f]);
	      }"string" == typeof d && a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), this.o.crossOrigin || a.setRequestHeader("X-Requested-With", "XMLHttpRequest");function i(a, b, c) {
	        return b + c.toUpperCase();
	      }if (d && d.getHeaders) {
	        g = d.getHeaders();for (f in g) {
	          h = f.replace(/(^|-)([a-z])/g, i), a.setRequestHeader(h, g[f]);
	        }
	      }return a.send(d), a;
	    }, _serializeFormElementToObject: function _serializeFormElementToObject(a) {
	      var b,
	          c,
	          d,
	          e = {},
	          f = /^(?:submit|button|image|reset)$/i,
	          g = /^(?:input|select|textarea|keygen)/i,
	          h = /^(?:checkbox|radio)$/i;for (b = 0; b < a.elements.length; b++) {
	        if (c = a.elements[b], d = c.type, !c.name || c.disabled || !g.test(c.nodeName) || f.test(d) || h.test(d) && !c.checked) continue;this._isFileInputElement(c) ? e[c.name] = c : e[c.name] = this._elementValue(c);
	      }return e;
	    }, _elementValue: function _elementValue(a) {
	      if ("select" === a.nodeName.toLowerCase()) {
	        var b,
	            c,
	            d = a.options,
	            e = a.selectedIndex,
	            f = "select-one" === a.type || 0 > e,
	            g = f ? null : [],
	            h = f ? e + 1 : d.length,
	            i = 0 > e ? h : f ? e : 0;for (; h > i; i++) {
	          if (c = d[i], (c.selected || i === e) && (!c.parentNode.disabled || "optgroup" !== c.parentNode.nodeName.toLowerCase())) {
	            if (b = c.attributes.value, b = !b || b.specified ? c.value : a.text, f) return b;g.push(b);
	          }
	        }return g;
	      }return a.value;
	    }, withOptions: function withOptions(a, b) {
	      var c,
	          d,
	          e = this.o,
	          f = {};for (c in e) {
	        f[c] = e[c];
	      }for (c in a) {
	        f[c] = a[c];
	      }return this.o = f, this._initOptions(), d = b.apply(this), this.o = e, this._initOptions(), d;
	    }, _requestVia: function _requestVia() {
	      return window.XDomainRequest && this.o.crossOrigin && /msie (8|9)\./i.test(window.navigator.appVersion) ? "xdr" : "xhr";
	    }, request: function request(a, b) {
	      var c,
	          d,
	          e,
	          f,
	          g = this,
	          h = [],
	          i = null,
	          j = function j() {},
	          k = null,
	          l = null,
	          m = this._requestVia(),
	          n = this.getTokenData(),
	          o = this.getAuthorizationHeader("accessToken"),
	          p = this.getCurrentFormat(),
	          q = a,
	          r = Array.prototype.slice.call(arguments),
	          s = {},
	          t = {};function u(a) {
	        var b, c;if (!g.o.disableFormData && window.FormData) {
	          if (a instanceof window.FormData) return a;if (g._isFormElement(a)) return new window.FormData(a);if (window.FormData && "object" == (typeof a === "undefined" ? "undefined" : _typeof(a))) {
	            c = new window.FormData();for (b in a) {
	              c.append(b, g._serializeObject(a[b]));
	            }return c;
	          }
	        }if (g._isFormElement(a)) {
	          a = g._serializeFormElementToObject(a);for (b in a) {
	            a[b] instanceof Array && (a[b] = a[b].join(","));
	          }
	        }if (g._findFileInput(a)) {
	          m = "iframe", c = {};for (b in a) {
	            g._isFileInputElement(a[b]) ? c[b] = a[b] : c[b] = g._serializeObject(a[b]);
	          }a = c;
	        } else "string" != typeof a && (a = g._serializeParams(a));return a;
	      }function v(a) {
	        var b = j(a);return b !== !1 && a.error && g.trigger("error", a), b;
	      }function w(a) {
	        return a.error && 401 === a.error.code && "/token" !== b && "/authentication" !== b;
	      }function x() {
	        g.request("POST", "/token", function (a) {
	          return a.error ? (z(r), v(a)) : (g.storeTokenData(a), g.request.apply(g, r), !1);
	        });
	      }function y(a, b) {
	        return a += -1 === a.indexOf("?") ? "?" : "&", a + g._serializeParams(b);
	      }function z(a) {
	        for (c = 2; c < a.length; c++) {
	          switch (e = a[c], typeof e === "undefined" ? "undefined" : _typeof(e)) {case "function":
	              j = e;break;case "object":
	              e && !e.nodeName && (window.ActiveXObject && e instanceof window.ActiveXObject || window.XMLHttpRequest && e instanceof window.XMLHttpRequest || window.XDomainRequest && e instanceof window.XDomainRequest) ? window.XDomainRequest && e instanceof window.XDomainRequest ? l = e : k = e : h.push(e);break;case "string":
	              h.push(g._unserializeParams(e));}
	        }
	      }if (!this.o.withoutAuthorization && n && !n.accessToken && "/token" !== b && "/authentication" !== b) return x();if (o && (t["X-MT-Authorization"] = o), ("/token" === b || "/authentication" === b) && (n && n.oneTimeToken ? (t["X-MT-Authorization"] = g.getAuthorizationHeader("oneTimeToken"), delete n.oneTimeToken) : n && n.sessionId ? t["X-MT-Authorization"] = g.getAuthorizationHeader("sessionId") : "/token" === b && "post" === q.toLowerCase() && delete t["X-MT-Authorization"], s.clientId = g.o.clientId), this.o.withoutAuthorization && delete t["X-MT-Authorization"], (this.o.suppressResponseCodes || "undefined" == typeof this.o.suppressResponseCodes && "xdr" === m) && (s.suppressResponseCodes = !0), this.o.cache || (s._ = new Date().getTime()), p !== this.constructor.getDefaultFormat() && (s.format = p.fileExtension), a.match(/^(put|delete)$/i) && (s.__method = a, a = "POST"), z(arguments), h.length && ("get" === a.toLowerCase() || h.length >= 2) && (b = y(b, h.shift())), h.length && (i = h.shift()), !this._isEmptyObject(s)) if ("get" === a.toLowerCase()) b = y(b, s);else if (window.FormData && i && i instanceof window.FormData) for (d in s) {
	        i.append(d, s[d]);
	      } else {
	        i = i || {};for (d in s) {
	          i[d] = s[d];
	        }
	      }i = u(i), f = this.o.baseUrl.replace(/\/*$/, "/") + "v" + this.getVersion(), b = b.replace(/^\/*/, "/");function A(a, c, d, e, f) {
	        var h, i, j, k;try {
	          i = a, j = g.findFormat(i) || g.getCurrentFormat(), h = j.unserialize(c);
	        } catch (l) {
	          h = { error: { code: +d, message: e || "Communication Error" } };
	        }if (w(h)) return x(), f && f(), !1;!h.error && "/authentication" === b && "delete" === q.toLowerCase() || h.error && 401 === h.error.code && ("/authentication" === b && "post" === q.toLowerCase() || "/token" === b && "post" === q.toLowerCase()) ? g.clearTokenData() : !h.error && ("/authentication" === b && "post" === q.toLowerCase() || "/token" === b && "post" === q.toLowerCase()) && g.storeTokenData(h), k = v(h), k !== !1 && h.error && 401 === h.error.code && "/authentication" !== b && g.trigger("authorizationRequired", h);
	      }if ("xdr" !== m) return "xhr" === m ? (k = k || this.newXMLHttpRequest(), "undefined" != typeof this.o.timeout && (k.timeout = this.o.timeout), k.onreadystatechange = function () {
	        var b, c;if (4 !== k.readyState) return;function d() {
	          k.onreadystatechange = function () {};
	        }if (b = A(k.getResponseHeader("Content-Type"), k.responseText, k.status, k.statusText, d), b === !1) return;c = k.getResponseHeader("X-MT-Next-Phase-URL"), c ? (k.abort(), g.sendXMLHttpRequest(k, a, f + c, i, t)) : d();
	      }, this.sendXMLHttpRequest(k, a, f + b, i, t)) : void function () {
	        var c,
	            d,
	            e,
	            h,
	            j = g._getNextIframeName(),
	            k = window.document,
	            l = k.createElement("form"),
	            m = k.createElement("iframe");l.action = f + b, l.target = j, l.method = a, l.style.display = "inline", l.encoding = "multipart/form-data", l.enctype = "multipart/form-data", m.name = j, m.style.position = "absolute", m.style.top = "-9999px", k.body.appendChild(m), m.contentWindow.name = j, i = i || {};for (c in t) {
	          i[c] = t[c];
	        }i["X-MT-Requested-Via"] = "IFRAME";for (c in i) {
	          if (g._isFileInputElement(i[c])) {
	            d = i[c], e = d.name, d.name = c, d.parentNode ? d.parentNode.insertBefore(l, d) : k.body.appendChild(l), l.appendChild(d);continue;
	          }h = k.createElement("input"), h.type = "hidden", h.name = c, h.value = i[c], l.appendChild(h);
	        }l.submit();function n() {
	          var a = m.contentWindow.document.body,
	              b = a.textContent || a.innerText,
	              c;function f() {
	            setTimeout(function () {
	              d.name = e, l.parentNode && (l.parentNode.insertBefore(d, l), l.parentNode.removeChild(l)), m.parentNode && m.parentNode.removeChild(m);
	            });
	          }try {
	            c = g.unserializeData(b);
	          } catch (h) {
	            c = { error: { code: 500, message: "Internal Server Error" } };
	          }if (w(c)) return x(), void f();f(), v(c);
	        }m.addEventListener ? m.addEventListener("load", n, !1) : m.attachEvent && m.attachEvent("onload", n);
	      }();if (!this._isEmptyObject(t)) throw "Cannot set request header when sending via XDomainRequest";l = l || new window.XDomainRequest(), l.onload = function () {
	        A(l.contentType, l.responseText, 200);
	      }, l.onerror = function () {
	        A(l.contentType, l.responseText, 404);
	      }, l.onprogress = function () {}, l.ontimeout = function () {
	        A(l.contentType, l.responseText, 0);
	      }, "undefined" != typeof this.o.timeout && (l.timeout = this.o.timeout || Number.MAX_VALUE), l.open(a, f + b), l.send(g._serializeParams(i) || null);
	    }, on: function on() {
	      this.constructor.on.apply(this, arguments);
	    }, off: function off() {
	      this.constructor.off.apply(this, arguments);
	    }, trigger: function trigger(a) {
	      var b,
	          c = Array.prototype.slice.call(arguments, 1),
	          d = (this.constructor.callbacks[a] || []).concat(this.callbacks[a] || []);for (b = 0; b < d.length; b++) {
	        d[b].apply(this, c);
	      }
	    }, _generateEndpointMethod: function _generateEndpointMethod(a) {
	      var b = this,
	          c = new RegExp(":([a-zA-Z_-]+)", "g"),
	          d = null,
	          e = a.id.replace(/_(\w)/g, function (a, b) {
	        return b.toUpperCase();
	      });function f() {
	        var b,
	            d = [];while (null !== (b = c.exec(a.route))) {
	          d.push(b[1]);
	        }return d;
	      }b[e] = function () {
	        d || (d = f());var c = Array.prototype.slice.call(arguments),
	            e = {},
	            g = {},
	            h,
	            i;for (i = 0; i < d.length; i++) {
	          e[d[i]] = c.shift();
	        }if (h = b.bindEndpointParams(a.route, e), a.resources) {
	          for (i = 0; i < a.resources.length; i++) {
	            g[a.resources[i]] = c.shift();
	          }c.push(g);
	        }return b.request.apply(b, [a.verb, h].concat(c));
	      };
	    }, generateEndpointMethods: function generateEndpointMethods(a) {
	      for (var b = 0; b < a.length; b++) {
	        this._generateEndpointMethod(a[b]);
	      }
	    }, loadEndpoints: function loadEndpoints(a) {
	      var b = this;b.withOptions({ withoutAuthorization: !0, async: !1 }, function () {
	        b.request("GET", "/endpoints", a, function (a) {
	          if (a.error) return;b.generateEndpointMethods(a.items);
	        });
	      });
	    } };var Cookie = function Cookie(a, b, c, d, e, f) {
	    this.name = a, this.value = b, this.domain = c, this.path = d, this.expires = e, this.secure = f;
	  };Cookie.prototype = { fetch: function fetch() {
	      if (!window.document) return undefined;var a = escape(this.name) + "=",
	          b = ("" + window.document.cookie).split(/;\s*/),
	          c;for (c = 0; c < b.length; c++) {
	        if (0 === b[c].indexOf(a)) return this.value = unescape(b[c].substring(a.length)), this;
	      }return undefined;
	    }, bake: function bake(a) {
	      if (!window.document) return undefined;function b(a) {
	        return a === undefined || null === a ? !1 : !0;
	      }if (!b(this.name)) return undefined;b(a) ? this.value = a : a = this.value;var c = escape(this.name),
	          d = (this.domain ? "; domain=" + escape(this.domain) : "") + (this.path ? "; path=" + escape(this.path) : "") + (this.expires ? "; expires=" + this.expires.toGMTString() : "") + (this.secure ? "; secure=1" : ""),
	          e = c + "=" + escape(a) + d;return window.document.cookie = e, this;
	    }, remove: function remove() {
	      this.expires = new Date(0), this.value = "", this.bake();
	    } }, Cookie.fetch = function (a) {
	    var b = new this(a);return b.fetch();
	  }, Cookie.bake = function (a, b, c, d, e, f) {
	    var g = new this(a, b, c, d, e, f);return g.bake();
	  }, Cookie.remove = function (a) {
	    var b = this.fetch(a);if (b) return b.remove();
	  };var JSON = window.JSON;return "object" != (typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) && (JSON = {}), function () {
	    function f(a) {
	      return 10 > a ? "0" + a : a;
	    }var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = { "\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" },
	        rep;function quote(a) {
	      return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function (a) {
	        var b = meta[a];return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
	      }) + '"' : '"' + a + '"';
	    }function str(a, b) {
	      var c,
	          d,
	          e,
	          f,
	          g = gap,
	          h,
	          i = b[a];switch (i && "object" == (typeof i === "undefined" ? "undefined" : _typeof(i)) && "function" == typeof i.toJSON && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i === "undefined" ? "undefined" : _typeof(i)) {case "string":
	          return quote(i);case "number":
	          return isFinite(i) ? String(i) : "null";case "boolean":case "null":
	          return String(i);case "object":
	          if (!i) return "null";if (gap += indent, h = [], "[object Array]" === Object.prototype.toString.apply(i)) {
	            for (f = i.length, c = 0; f > c; c += 1) {
	              h[c] = str(c, i) || "null";
	            }return e = 0 === h.length ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", gap = g, e;
	          }if (rep && "object" == (typeof rep === "undefined" ? "undefined" : _typeof(rep))) for (f = rep.length, c = 0; f > c; c += 1) {
	            "string" == typeof rep[c] && (d = rep[c], e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
	          } else for (d in i) {
	            Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
	          }return e = 0 === h.length ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", gap = g, e;}
	    }"function" != typeof JSON.stringify && (JSON.stringify = function (a, b, c) {
	      var d;if (gap = "", indent = "", "number" == typeof c) for (d = 0; c > d; d += 1) {
	        indent += " ";
	      } else "string" == typeof c && (indent = c);if (rep = b, b && "function" != typeof b && ("object" != (typeof b === "undefined" ? "undefined" : _typeof(b)) || "number" != typeof b.length)) throw new Error("JSON.stringify");return str("", { "": a });
	    }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) {
	      var j;function walk(a, b) {
	        var c,
	            d,
	            e = a[b];if (e && "object" == (typeof e === "undefined" ? "undefined" : _typeof(e))) for (c in e) {
	          Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), d !== undefined ? e[c] = d : delete e[c]);
	        }return reviver.call(a, b, e);
	      }if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (a) {
	        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
	      })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j;throw new SyntaxError("JSON.parse");
	    });
	  }(), DataAPI.on("initialize", function () {
	    this.generateEndpointMethods([{ id: "list_endpoints", route: "/endpoints", verb: "GET", resources: null }, { id: "authenticate", route: "/authentication", verb: "POST", resources: null }, { id: "get_token", route: "/token", verb: "POST", resources: null }, { id: "revoke_authentication", route: "/authentication", verb: "DELETE", resources: null }, { id: "revoke_token", route: "/token", verb: "DELETE", resources: null }, { id: "get_user", route: "/users/:user_id", verb: "GET", resources: null }, { id: "update_user", route: "/users/:user_id", verb: "PUT", resources: ["user"] }, { id: "list_blogs_for_user", route: "/users/:user_id/sites", verb: "GET", resources: null }, { id: "get_blog", route: "/sites/:site_id", verb: "GET", resources: null }, { id: "list_entries", route: "/sites/:site_id/entries", verb: "GET", resources: null }, { id: "create_entry", route: "/sites/:site_id/entries", verb: "POST", resources: ["entry"] }, { id: "get_entry", route: "/sites/:site_id/entries/:entry_id", verb: "GET", resources: null }, { id: "update_entry", route: "/sites/:site_id/entries/:entry_id", verb: "PUT", resources: ["entry"] }, { id: "delete_entry", route: "/sites/:site_id/entries/:entry_id", verb: "DELETE", resources: null }, { id: "list_categories", route: "/sites/:site_id/categories", verb: "GET", resources: null }, { id: "list_comments", route: "/sites/:site_id/comments", verb: "GET", resources: null }, { id: "list_comments_for_entry", route: "/sites/:site_id/entries/:entry_id/comments", verb: "GET", resources: null }, { id: "create_comment", route: "/sites/:site_id/entries/:entry_id/comments", verb: "POST", resources: ["comment"] }, { id: "create_reply_comment", route: "/sites/:site_id/entries/:entry_id/comments/:comment_id/replies", verb: "POST", resources: ["comment"] }, { id: "get_comment", route: "/sites/:site_id/comments/:comment_id", verb: "GET", resources: null }, { id: "update_comment", route: "/sites/:site_id/comments/:comment_id", verb: "PUT", resources: ["comment"] }, { id: "delete_comment", route: "/sites/:site_id/comments/:comment_id", verb: "DELETE", resources: null }, { id: "list_trackbacks", route: "/sites/:site_id/trackbacks", verb: "GET", resources: null }, { id: "list_trackbacks_for_entry", route: "/sites/:site_id/entries/:entry_id/trackbacks", verb: "GET", resources: null }, { id: "get_trackback", route: "/sites/:site_id/trackbacks/:ping_id", verb: "GET", resources: null }, { id: "update_trackback", route: "/sites/:site_id/trackbacks/:ping_id", verb: "PUT", resources: ["trackback"] }, { id: "delete_trackback", route: "/sites/:site_id/trackbacks/:ping_id", verb: "DELETE", resources: null }, { id: "upload_asset", route: "/sites/:site_id/assets/upload", verb: "POST", resources: null }, { id: "list_permissions_for_user", route: "/users/:user_id/permissions", verb: "GET", resources: null }, { id: "publish_entries", route: "/publish/entries", verb: "GET", resources: null }, { id: "get_stats_provider", route: "/sites/:site_id/stats/provider", verb: "GET", resources: null }, { id: "list_stats_pageviews_for_path", route: "/sites/:site_id/stats/path/pageviews", verb: "GET", resources: null }, { id: "list_stats_visits_for_path", route: "/sites/:site_id/stats/path/visits", verb: "GET", resources: null }, { id: "list_stats_pageviews_for_date", route: "/sites/:site_id/stats/date/pageviews", verb: "GET", resources: null }, { id: "list_stats_visits_for_date", route: "/sites/:site_id/stats/date/visits", verb: "GET", resources: null }, { id: "list_categories", route: "/sites/:site_id/categories", verb: "GET", resources: null }, { id: "list_categories_for_entry", route: "/sites/:site_id/entries/:entry_id/categories", verb: "GET", resources: null }, { id: "list_parent_categories", route: "/sites/:site_id/categories/:category_id/parents", verb: "GET", resources: null }, { id: "list_sibling_categories", route: "/sites/:site_id/categories/:category_id/siblings", verb: "GET", resources: null }, { id: "list_child_categories", route: "/sites/:site_id/categories/:category_id/children", verb: "GET", resources: null }, { id: "create_category", route: "/sites/:site_id/categories", verb: "POST", resources: ["category"] }, { id: "get_category", route: "/sites/:site_id/categories/:category_id", verb: "GET", resources: null }, { id: "update_category", route: "/sites/:site_id/categories/:category_id", verb: "PUT", resources: ["category"] }, { id: "delete_category", route: "/sites/:site_id/categories/:category_id", verb: "DELETE", resources: null }, { id: "permutate_categories", route: "/sites/:site_id/categories/permutate", verb: "POST", resources: null }, { id: "list_folders", route: "/sites/:site_id/folders", verb: "GET", resources: null }, { id: "list_parent_folders", route: "/sites/:site_id/folders/:folder_id/parents", verb: "GET", resources: null }, { id: "list_sibling_folders", route: "/sites/:site_id/folders/:folder_id/siblings", verb: "GET", resources: null }, { id: "list_child_folders", route: "/sites/:site_id/folders/:folder_id/children", verb: "GET", resources: null }, { id: "create_folder", route: "/sites/:site_id/folders", verb: "POST", resources: ["folder"] }, { id: "get_folder", route: "/sites/:site_id/folders/:folder_id", verb: "GET", resources: null }, { id: "update_folder", route: "/sites/:site_id/folders/:folder_id", verb: "PUT", resources: ["folder"] }, { id: "delete_folder", route: "/sites/:site_id/folders/:folder_id", verb: "DELETE", resources: null }, { id: "permutate_folders", route: "/sites/:site_id/folders/permutate", verb: "POST", resources: null }, { id: "list_assets", route: "/sites/:site_id/assets", verb: "GET", resources: null }, { id: "list_assets_for_entry", route: "/sites/:site_id/entries/:entry_id/assets", verb: "GET", resources: null }, { id: "list_assets_for_page", route: "/sites/:site_id/pages/:page_id/assets", verb: "GET", resources: null }, { id: "list_assets_for_site_and_tag", route: "/sites/:site_id/tags/:tag_id/assets", verb: "GET", resources: null }, { id: "upload_asset", route: "/assets/upload", verb: "POST", resources: null }, { id: "upload_asset_for_site", route: "/sites/:site_id/assets/upload", verb: "POST", resources: null }, { id: "get_asset", route: "/sites/:site_id/assets/:asset_id", verb: "GET", resources: null }, { id: "update_asset", route: "/sites/:site_id/assets/:asset_id", verb: "PUT", resources: ["asset"] }, { id: "delete_asset", route: "/sites/:site_id/assets/:asset_id", verb: "DELETE", resources: null }, { id: "get_thumbnail", route: "/sites/:site_id/assets/:asset_id/thumbnail", verb: "GET", resources: null }, { id: "list_entries_for_category", route: "/sites/:site_id/categories/:category_id/entries", verb: "GET", resources: null }, { id: "list_entries_for_asset", route: "/sites/:site_id/assets/:asset_id/entries", verb: "GET", resources: null }, { id: "list_entries_for_site_and_tag", route: "/sites/:site_id/tags/:tag_id/entries", verb: "GET", resources: null }, { id: "create_entry", route: "/sites/:site_id/entries", verb: "POST", resources: ["entry"] }, { id: "update_entry", route: "/sites/:site_id/entries/:entry_id", verb: "PUT", resources: ["entry"] }, { id: "import_entries", route: "/sites/:site_id/entries/import", verb: "POST", resources: null }, { id: "export_entries", route: "/sites/:site_id/entries/export", verb: "GET", resources: null }, { id: "preview_entry_by_id", route: "/sites/:site_id/entries/:entry_id/preview", verb: "POST", resources: null }, { id: "preview_entry", route: "/sites/:site_id/entries/preview", verb: "POST", resources: null }, { id: "list_pages", route: "/sites/:site_id/pages", verb: "GET", resources: null }, { id: "list_pages_for_folder", route: "/sites/:site_id/folders/:folder_id/pages", verb: "GET", resources: null }, { id: "list_pages_for_asset", route: "/sites/:site_id/assets/:asset_id/pages", verb: "GET", resources: null }, { id: "list_pages_for_site_and_tag", route: "/sites/:site_id/tags/:tag_id/pages", verb: "GET", resources: null }, { id: "create_page", route: "/sites/:site_id/pages", verb: "POST", resources: ["page"] }, { id: "get_page", route: "/sites/:site_id/pages/:page_id", verb: "GET", resources: null }, { id: "update_page", route: "/sites/:site_id/pages/:page_id", verb: "PUT", resources: ["page"] }, { id: "delete_page", route: "/sites/:site_id/pages/:page_id", verb: "DELETE", resources: null }, { id: "preview_page_by_id", route: "/sites/:site_id/pages/:page_id/preview", verb: "POST", resources: null }, { id: "preview_page", route: "/sites/:site_id/pages/preview", verb: "POST", resources: null }, { id: "list_comments_for_page", route: "/sites/:site_id/pages/:page_id/comments", verb: "GET", resources: null }, { id: "create_comment_for_page", route: "/sites/:site_id/pages/:page_id/comments", verb: "POST", resources: ["comment"] }, { id: "create_reply_comment_for_page", route: "/sites/:site_id/pages/:page_id/comments/:comment_id/replies", verb: "POST", resources: ["comment"] }, { id: "list_trackbacks_for_page", route: "/sites/:site_id/pages/:page_id/trackbacks", verb: "GET", resources: null }, { id: "list_sites", route: "/sites", verb: "GET", resources: null }, { id: "list_sites_by_parent", route: "/sites/:site_id/children", verb: "GET", resources: null }, { id: "insert_new_blog", route: "/sites/:site_id", verb: "POST", resources: ["blog"] }, { id: "insert_new_website", route: "/sites", verb: "POST", resources: ["website"] }, { id: "update_site", route: "/sites/:site_id", verb: "PUT", resources: null }, { id: "delete_site", route: "/sites/:site_id", verb: "DELETE", resources: null }, { id: "list_roles", route: "/roles", verb: "GET", resources: null }, { id: "create_role", route: "/roles", verb: "POST", resources: ["role"] }, { id: "get_role", route: "/roles/:role_id", verb: "GET", resources: null }, { id: "update_role", route: "/roles/:role_id", verb: "PUT", resources: ["role"] }, { id: "delete_role", route: "/roles/:role_id", verb: "DELETE", resources: null }, { id: "list_permissions", route: "/permissions", verb: "GET", resources: null }, { id: "list_permissions_for_user", route: "/users/:user_id/permissions", verb: "GET", resources: null }, { id: "list_permissions_for_site", route: "/sites/:site_id/permissions", verb: "GET", resources: null }, { id: "list_permissions_for_role", route: "/roles/:role_id/permissions", verb: "GET", resources: null }, { id: "grant_permission_to_site", route: "/sites/:site_id/permissions/grant", verb: "POST", resources: null }, { id: "grant_permission_to_user", route: "/users/:user_id/permissions/grant", verb: "POST", resources: null }, { id: "revoke_permission_from_site", route: "/sites/:site_id/permissions/revoke", verb: "POST", resources: null }, { id: "revoke_permission_from_user", route: "/users/:user_id/permissions/revoke", verb: "POST", resources: null }, { id: "search", route: "/search", verb: "GET", resources: null }, { id: "list_logs", route: "/sites/:site_id/logs", verb: "GET", resources: null }, { id: "get_log", route: "/sites/:site_id/logs/:log_id", verb: "GET", resources: null }, { id: "create_log", route: "/sites/:site_id/logs", verb: "POST", resources: ["log"] }, { id: "update_log", route: "/sites/:site_id/logs/:log_id", verb: "PUT", resources: ["log"] }, { id: "delete_log", route: "/sites/:site_id/logs/:log_id", verb: "DELETE", resources: null }, { id: "reset_logs", route: "/sites/:site_id/logs", verb: "DELETE", resources: null }, { id: "export_logs", route: "/sites/:site_id/logs/export", verb: "GET", resources: null }, { id: "list_tags_for_site", route: "/sites/:site_id/tags", verb: "GET", resources: null }, { id: "get_tag_for_site", route: "/sites/:site_id/tags/:tag_id", verb: "GET", resources: null }, { id: "rename_tag_for_site", route: "/sites/:site_id/tags/:tag_id", verb: "PUT", resources: null }, { id: "delete_tag_for_site", route: "/sites/:site_id/tags/:tag_id", verb: "DELETE", resources: null }, { id: "list_themes", route: "/themes", verb: "GET", resources: null }, { id: "list_themes_for_site", route: "/sites/:site_id/themes", verb: "GET", resources: null }, { id: "get_theme", route: "/themes/:theme_id", verb: "GET", resources: null }, { id: "get_theme_for_site", route: "/sites/:site_id/themes/:theme_id", verb: "GET", resources: null }, { id: "apply_theme_to_site", route: "/sites/:site_id/themes/:theme_id/apply", verb: "POST", resources: null }, { id: "uninstall_theme", route: "/themes/:theme_id", verb: "DELETE", resources: null }, { id: "export_site_theme", route: "/sites/:site_id/export_theme", verb: "POST", resources: null }, { id: "list_templates", route: "/sites/:site_id/templates", verb: "GET", resources: null }, { id: "get_template", route: "/sites/:site_id/templates/:template_id", verb: "GET", resources: null }, { id: "create_template", route: "/sites/:site_id/templates", verb: "POST", resources: ["template"] }, { id: "update_template", route: "/sites/:site_id/templates/:template_id", verb: "PUT", resources: ["template"] }, { id: "delete_template", route: "/sites/:site_id/templates/:template_id", verb: "DELETE", resources: null }, { id: "publish_template", route: "/sites/:site_id/templates/:template_id/publish", verb: "POST", resources: null }, { id: "refresh_template", route: "/sites/:site_id/templates/:template_id/refresh", verb: "POST", resources: null }, { id: "refresh_templates_for_site", route: "/sites/:site_id/refresh_templates", verb: "POST", resources: null }, { id: "clone_template", route: "/sites/:site_id/templates/:template_id/clone", verb: "POST", resources: null }, { id: "preview_template_by_id", route: "/sites/:site_id/templates/:template_id/preview", verb: "POST", resources: null }, { id: "preview_template", route: "/sites/:site_id/templates/preview", verb: "POST", resources: null }, { id: "list_templatemaps", route: "/sites/:site_id/templates/:template_id/templatemaps", verb: "GET", resources: null }, { id: "get_templatemap", route: "/sites/:site_id/templates/:template_id/templatemaps/:templatemap_id", verb: "GET", resources: null }, { id: "create_templatemap", route: "/sites/:site_id/templates/:template_id/templatemaps", verb: "POST", resources: ["templatemap"] }, { id: "update_templatemap", route: "/sites/:site_id/templates/:template_id/templatemaps/:templatemap_id", verb: "PUT", resources: ["templatemap"] }, { id: "delete_templatemap", route: "/sites/:site_id/templates/:template_id/templatemaps/:templatemap_id", verb: "DELETE", resources: null }, { id: "list_widgetsets", route: "/sites/:site_id/widgetsets", verb: "GET", resources: null }, { id: "get_widgetset", route: "/sites/:site_id/widgetsets/:widgetset_id", verb: "GET", resources: null }, { id: "create_widgetset", route: "/sites/:site_id/widgetsets", verb: "POST", resources: ["widgetset"] }, { id: "update_widgetset", route: "/sites/:site_id/widgetsets/:widgetset_id", verb: "PUT", resources: ["widgetset"] }, { id: "delete_widgetset", route: "/sites/:site_id/widgetsets/:widgetset_id", verb: "DELETE", resources: null }, { id: "list_widgets", route: "/sites/:site_id/widgets", verb: "GET", resources: null }, { id: "list_widgets_for_widgetset", route: "/sites/:site_id/widgetsets/:widgetset_id/widgets", verb: "GET", resources: null }, { id: "get_widgets", route: "/sites/:site_id/widgets/:widget_id", verb: "GET", resources: null }, { id: "get_widget_for_widgetset", route: "/sites/:site_id/widgetsets/:widgetset_id/widgets/:widget_id", verb: "GET", resources: null }, { id: "create_widget", route: "/sites/:site_id/widgets", verb: "POST", resources: ["widget"] }, { id: "update_widget", route: "/sites/:site_id/widgets/:widget_id", verb: "PUT", resources: ["widget"] }, { id: "delete_widget", route: "/sites/:site_id/widgets/:widget_id", verb: "DELETE", resources: null }, { id: "refresh_widget", route: "/sites/:site_id/widgets/:widget_id/refresh", verb: "POST", resources: null }, { id: "clone_widget", route: "/sites/:site_id/widgets/:widget_id/clone", verb: "POST", resources: null }, { id: "list_users", route: "/users", verb: "GET", resources: null }, { id: "create_user", route: "/users", verb: "POST", resources: ["user"] }, { id: "delete_user", route: "/users/:user_id", verb: "DELETE", resources: null }, { id: "unlock_user", route: "/users/:user_id/unlock", verb: "POST", resources: null }, { id: "recover_password_for_user", route: "/users/:user_id/recover_password", verb: "POST", resources: null }, { id: "recover_password", route: "/recover_password", verb: "POST", resources: null }, { id: "list_plugins", route: "/plugins", verb: "GET", resources: null }, { id: "get_plugin", route: "/plugins/:plugin_id", verb: "GET", resources: null }, { id: "enable_plugin", route: "/plugins/:plugin_id/enable", verb: "POST", resources: null }, { id: "disable_plugin", route: "/plugins/:plugin_id/disable", verb: "POST", resources: null }, { id: "enable_all_plugins", route: "/plugins/enable", verb: "POST", resources: null }, { id: "disable_all_plugins", route: "/plugins/disable", verb: "POST", resources: null }, { id: "backup_site", route: "/sites/:site_id/backup", verb: "GET", resources: null }, { id: "authenticate", route: "/authentication", verb: "POST", resources: null }, { id: "upload_asset", route: "/assets/upload", verb: "POST", resources: null }, { id: "upload_asset_for_site", route: "/sites/:site_id/assets/upload", verb: "POST", resources: null }, { id: "list_fields", route: "/sites/:site_id/fields", verb: "GET", resources: null }, { id: "get_field", route: "/sites/:site_id/fields/:field_id", verb: "GET", resources: null }, { id: "create_field", route: "/sites/:site_id/fields", verb: "POST", resources: ["field"] }, { id: "update_field", route: "/sites/:site_id/fields/:field_id", verb: "PUT", resources: ["field"] }, { id: "delete_field", route: "/sites/:site_id/fields/:field_id", verb: "DELETE", resources: null }, { id: "list_groups", route: "/groups", verb: "GET", resources: null }, { id: "list_groups_for_user", route: "/users/:user_id/groups", verb: "GET", resources: null }, { id: "get_group", route: "/groups/:group_id", verb: "GET", resources: null }, { id: "create_group", route: "/groups", verb: "POST", resources: ["group"] }, { id: "update_group", route: "/groups/:group_id", verb: "PUT", resources: ["group"] }, { id: "delete_group", route: "/groups/:group_id", verb: "DELETE", resources: null }, { id: "synchronize_groups", route: "/groups/synchronize", verb: "POST", resources: null }, { id: "list_permissions_for_group", route: "/groups/:group_id/permissions", verb: "GET", resources: null }, { id: "grant_permission_to_group", route: "/groups/:group_id/permissions/grant", verb: "POST", resources: null }, { id: "revoke_permission_from_group", route: "/groups/:group_id/permissions/revoke", verb: "POST", resources: null }, { id: "list_members_for_group", route: "/groups/:group_id/members", verb: "GET", resources: null }, { id: "get_member_for_group", route: "/groups/:group_id/members/:member_id", verb: "GET", resources: null }, { id: "add_member_to_group", route: "/groups/:group_id/members", verb: "POST", resources: null }, { id: "remove_member_from_group", route: "/groups/:group_id/members/:member_id", verb: "DELETE", resources: null }, { id: "bulk_author_import", route: "/users/import", verb: "POST", resources: null }, { id: "bulk_author_export", route: "/users/export", verb: "GET", resources: null }, { id: "synchronize_users", route: "/users/synchronize", verb: "POST", resources: null }, { id: "list_formatted_texts", route: "/sites/:site_id/formatted_texts", verb: "GET", resources: null }, { id: "get_formatted_text", route: "/sites/:site_id/formatted_texts/:formatted_text_id", verb: "GET", resources: null }, { id: "create_formatted_text", route: "/sites/:site_id/formatted_texts", verb: "POST", resources: ["formatted_text"] }, { id: "update_formatted_text", route: "/sites/:site_id/formatted_texts/:formatted_text_id", verb: "PUT", resources: ["formatted_text"] }, { id: "delete_formatted_text", route: "/sites/:site_id/formatted_texts/:formatted_text_id", verb: "DELETE", resources: null }]);
	  }), window.MT = window.MT || {}, window.MT.DataAPI = window.MT.DataAPI || DataAPI, window.MT.DataAPI["v" + DataAPI.version] = DataAPI, DataAPI;
	});
	//# sourceMappingURL=mt-data-api.min.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(8);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtassets', '<mtdummy each="{asset, i in assets}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var dataapi = __webpack_require__(1);

	  if ('blog_id' in opts) {
	    this.blog_id = opts.blog_id;
	  } else if (this.blog) {
	    this.blog_id = this.blog.id;
	  } else {
	    this.blog_id = dataapi.blogId;
	  }

	  this.assets = [];

	  var self = this;

	  this.on('mount', function () {
	    if (self.blog_id === null || self.blog_id === undefined) {
	      console.log('MTAssets tag need blog_id parameter');
	      return;
	    }

	    dataapi.client.listAssets(self.blog_id, function (response) {
	      if (response.error) {
	        console.log(response.error);
	        list.assets = [];
	        self.update();
	        return;
	      }

	      self.assets = response.items;
	      self.update();
	    });
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtdummy', '<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtassetdescription', '{asset.description}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtassetfileext', '{asset.fileExtension}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtassetfilename', '{asset.filename}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtassetid', '{asset.id}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtassetlabel', '{asset.label}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtassetmimetype', '{asset.mimeType}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtassettype', '{asset.type}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtasseturl', '{asset.url}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(23);
	__webpack_require__(24);
	__webpack_require__(25);
	__webpack_require__(26);
	__webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(29);
	__webpack_require__(30);
	__webpack_require__(31);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtblogs', '<mtdummy each="{blog, i in blogs}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var dataapi = __webpack_require__(1);

	  this.blogs = [];

	  var self = this;

	  this.on('mount', function () {
	    var limit = opts.limit || 25;
	    self.fetch(limit, 100, 0);
	  });

	  this.fetch = function (totalLimit, limit, offset) {
	    dataapi.client.listSites({ limit: limit, offset: offset }, function (response) {
	      if (response.error) {
	        console.log(response.error);
	        self.update();
	        return;
	      }

	      if (response.items.length === 0) {
	        self.update();
	        return;
	      }

	      for (var i = 0; i < response.items.length; i++) {
	        var item = response.items[i];
	        if (item.class === 'blog') {
	          self.blogs.push(item);
	        }
	      }

	      if (response.totalResults <= limit * (offset + 1) || self.blogs.length >= totalLimit) {
	        while (self.blogs.length > totalLimit) {
	          self.blogs.pop();
	        }
	        self.update();
	        return;
	      }

	      self.fetch(totalLimit, limit, offset + limit);
	    });
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogarchiveurl', '{blog.archiveUrl}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogcclicenseimage', '{blog.ccLicenseImage}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogcclicenseurl', '{blog.ccLicenseUrl}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogdatelanguage', '{blog.dateLanguage}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogdescription', '{blog.description}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtbloghost', '{blog.host}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogid', '{blog.id}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtbloglanguage', '{blog.language}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogname', '{blog.name}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogrelativeurl', '{blog.relativeUrl}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogtimezone', '{blog.timezone}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtblogurl', '{blog.url}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(36);
	__webpack_require__(37);
	__webpack_require__(38);

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtcategories', '<mtdummy each="{category, i in categories}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var _this = this;

	  var dataapi = __webpack_require__(1);

	  if ('blog_id' in opts) {
	    this.blog_id = opts.blog_id;
	  } else {
	    this.blog_id = dataapi.blogId;
	  }

	  this.categories = [];
	  this.categoriesCount = 0;

	  var self = this;
	  this.on('mount', function () {
	    if (_this.blog_id === null || _this.blog_id === undefined) {
	      console.log('MTCategories tag needs blog_id parameter.');
	      return;
	    }

	    dataapi.client.listCategories(self.blog_id, function (response) {
	      if (response.error) {
	        console.log(response.error);
	        return;
	      }

	      self.categories = response.items;
	      self.categoriesCount = response.totalResults;

	      self.update();
	    });
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcategoryarchivelink', '{category.archiveLink}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcategorybasename', '{category.basename}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcategorydescription', '{category.description}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcategoryid', '{category.id}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcategorylabel', '{category.label}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(40);
	__webpack_require__(41);
	__webpack_require__(42);
	__webpack_require__(43);
	__webpack_require__(44);

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtcomments', '<mtcomment each="{comment, i in comments}"><yield></yield></mtcomment>', '', '', function (opts) {
	  var _this = this;

	  var dataapi = __webpack_require__(1);

	  if ('blog_id' in opts) {
	    this.blog_id = opts.blog_id;
	  } else {
	    this.blog_id = dataapi.blogId;
	  }

	  this.comments = [];
	  this.commentsCount = 0;

	  var self = this;
	  this.on('mount', function () {
	    if (self.blog_id === null || self.blog_id === undefined) {
	      console.log('MTComments tag needs blog_id parameter.');
	      return;
	    }

	    dataapi.client.listComments(self.blog_id, self.makeParams(), function (response) {
	      if (response.error) {
	        console.log(response.error);
	        return;
	      }

	      self.comments = response.items;
	      self.commentsCount = response.totalResults;

	      self.update();
	    });
	  });

	  this.makeParams = function () {
	    var params = {};

	    if (_this.limit) {
	      params.limit = _this.limit;
	    }
	    if (_this.offset) {
	      params.offset = _this.offset;
	    }

	    return params;
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcommentbody', '<yield></yield>', '', '', function (opts) {
	  var _this = this;

	  this.on('update', function () {
	    if (_this.comment && _this.comment.body) {
	      _this.root.innerHTML = _this.comment.body;
	    }
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcommententryid', '{comment.entry.id}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcommentid', '{comment.id}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtcommentlink', '{comment.link}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(9);

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(47);
	__webpack_require__(48);
	__webpack_require__(49);
	__webpack_require__(50);
	__webpack_require__(51);
	__webpack_require__(52);
	__webpack_require__(53);
	__webpack_require__(54);
	__webpack_require__(55);
	__webpack_require__(56);
	__webpack_require__(57);
	__webpack_require__(58);
	__webpack_require__(59);

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtentries', '<mtdummy each="{entry, i in entries}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var _this = this;

	  var dataapi = __webpack_require__(1);

	  if ('blog_id' in opts) {
	    this.blog_id = opts.blog_id;
	  } else {
	    this.blog_id = dataapi.blogId;
	  }

	  this.entries = [];
	  this.entriesCount = 0;

	  var self = this;
	  this.on('mount', function () {
	    if (self.blog_id === null || self.blog_id === undefined) {
	      console.log('MTEntries tag needs blog_id parameter.');
	      return;
	    }

	    dataapi.client.listEntries(self.blog_id, self.makeParams(), function (response) {
	      if (response.error) {
	        console.log(response.error);
	        return;
	      }

	      self.entries = response.items;
	      self.entriesCount = response.totalResults;

	      self.update();
	    });
	  });

	  this.makeParams = function () {
	    var params = {};

	    if (_this.limit) {
	      params.limit = _this.limit;
	    }
	    if (_this.offset) {
	      params.offset = _this.offset;
	    }

	    return params;
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentriescount', '{entriesCount}<yield></yield>', '', '', function (opts) {
	  this.on('mount', function () {
	    if (this.parent && this.parent.parent && this.parent.parent.entriesCount) {
	      this.entriesCount = this.parent.parent.entriesCount;
	      this.update();
	    } else {
	      var params = { field: "id" };
	      dataapi.listEntries(2, params, function (response) {
	        if (response.error) {
	          console.log(response.error);
	          this.entriesCount = -1;
	        }
	        this.entriesCount = response.totalResults;
	        this.update();
	      });
	    }
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentriesfooter', '<div if="{isLast}"><yield></yield></div>', '', '', function (opts) {

	  this.isLast = false;

	  this.on('update', function () {
	    if (this.parent && this.parent.parent) {
	      if (this.parent.parent.entries.length === 0 || this.parent.parent.entries.length - 1 === this.i) {
	        this.isLast = true;
	      } else {
	        this.isLast = false;
	      }
	    } else {
	      this.isLast = false;
	    }
	    this.update();
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentriesheader', '<div if="{i === 0}"><yield></yield></div>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentrybody', '<yield></yield>', '', '', function (opts) {
	  var _this = this;

	  this.on('update', function () {
	    if (_this.entry && _this.entry.body) {
	      _this.root.innerHTML = _this.entry.body;
	    }
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentryclass', '{entry.class}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentryexcerpt', '<yield></yield>', '', '', function (opts) {
	  this.on('update', function () {
	    if (this.entry && this.entry.excerpt) {
	      this.root.innerHTML = this.entry.excerpt;
	    }
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentryid', '{entry.id}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentrykeywords', '{entry.keywords}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentrymore', '<yield></yield>', '', '', function (opts) {
	  this.on('update', function () {
	    if (this.entry && this.entry.more) {
	      this.root.childNodes[0].innerHTML = this.entry.more;
	    }
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentrypermalink', '{entry.permalink}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentrypermalinkblock', '<a href="{entry.permalink}"><yield></yield></a>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtentrytitle', '{entry.title}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(61);
	__webpack_require__(62);
	__webpack_require__(63);
	__webpack_require__(64);
	__webpack_require__(65);

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtfolders', '<mtdummy each="{category, i in categories}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var _this = this;

	  var dataapi = __webpack_require__(1);

	  if ('blog_id' in opts) {
	    this.blog_id = opts.blog_id;
	  } else {
	    this.blog_id = dataapi.blogId;
	  }

	  this.categories = [];
	  this.categoriesCount = 0;

	  var self = this;
	  this.on('mount', function () {
	    if (_this.blog_id === null || _this.blog_id === undefined) {
	      console.log('MTFolders tag needs blog_id parameter.');
	      return;
	    }

	    dataapi.client.listFolders(self.blog_id, function (response) {
	      if (response.error) {
	        console.log(response.error);
	        return;
	      }

	      self.categories = response.items;
	      self.categoriesCount = response.totalResults;

	      self.update();
	    });
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(35);
	riot.tag2('mtfolderbasename', '<mtcategorybasename><yield></yield></mtcategorybasename>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(36);
	riot.tag2('mtfolderdescription', '<mtcategorydescription><yield></yield></mtcategorydescription>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(37);
	riot.tag2('mtfolderid', '<mtcategoryid><yield></yield></mtcategoryid>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(38);
	riot.tag2('mtfolderlabel', '<mtcategorylabel><yield></yield></mtcategorylabel>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(67);
	__webpack_require__(68);
	__webpack_require__(69);
	__webpack_require__(70);
	__webpack_require__(71);
	__webpack_require__(72);
	__webpack_require__(73);
	__webpack_require__(74);
	__webpack_require__(75);
	__webpack_require__(76);
	__webpack_require__(77);

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtpages', '<mtdummy each="{entry, i in entries}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var _this = this;

	  var dataapi = __webpack_require__(1);

	  if ('blog_id' in opts) {
	    this.blog_id = opts.blog_id;
	  } else {
	    this.blog_id = dataapi.blogId;
	  }

	  this.entries = [];
	  this.entriesCount = 0;

	  var self = this;
	  this.on('mount', function () {
	    if (self.blog_id === null || self.blog_id == undefined) {
	      console.log('MTPages tag needs blog_id parameter.');
	      return;
	    }

	    dataapi.client.listPages(self.blog_id, self.makeParams(), function (response) {
	      if (response.error) {
	        console.log(response.error);
	        return;
	      }

	      self.entries = response.items;
	      self.entriesCount = response.totalResults;

	      self.update();
	    });
	  });

	  this.makeParams = function () {
	    var params = {};

	    if (_this.limit) {
	      params.limit = _this.limit;
	    }
	    if (_this.offset) {
	      params.offset = _this.offset;
	    }

	    return params;
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(48);
	riot.tag2('mtpagescount', '<mtentriescount><yield></yield></mtentriescount>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(49);
	riot.tag2('mtpagesfooter', '<mtentriesfooter><yield></mtentriesfooter>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(50);
	riot.tag2('mtpagesheader', '<mtentriesheader><yield></yield></mtentriesheader>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(51);
	riot.tag2('mtpagebody', '<mtentrybody><yield></yield></mtentrybody>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(53);
	riot.tag2('mtpageexcerpt', '<mtentryexcerpt><yield></yield></mtentryexcerpt>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(54);
	riot.tag2('mtpageid', '<mtentryid><yield></yield></mtentryid>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(55);
	riot.tag2('mtpagekeywords', '<mtentrykeywords><yield></yield></mtentrykeywords>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(56);
	riot.tag2('mtpagemore', '<mtentrymore><yield></yield></mtentrymore>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(57);
	riot.tag2('mtpagepermalink', '<mtentrypermalink><yield></yield></mtentrypermalink>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(59);
	riot.tag2('mtpagetitle', '<mtentrytitle><yield></yield></mtentrytitle>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(79);
	__webpack_require__(80);
	__webpack_require__(81);
	__webpack_require__(82);
	__webpack_require__(83);
	__webpack_require__(84);
	__webpack_require__(85);
	__webpack_require__(86);
	__webpack_require__(87);

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtpings', '<mtdummy each="{ping, i in pings}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var _this = this;

	  var dataapi = __webpack_require__(1);

	  if ('blog_id' in opts) {
	    this.blog_id = opts.blog_id;
	  } else {
	    this.blog_id = dataapi.blogId;
	  }

	  this.pings = [];
	  this.pingsCount = 0;

	  var self = this;
	  this.on('mount', function () {
	    if (self.blog_id === null || self.blog_id === undefined) {
	      console.log('MTPings tag needs blog_id parameter.');
	      return;
	    }

	    dataapi.client.listTrackbacks(self.blog_id, self.makeParams(), function (response) {
	      if (response.error) {
	        console.log(response.error);
	        return;
	      }

	      self.pings = response.items;
	      self.pingsCount = response.totalResults;

	      self.update();
	    });
	  });

	  this.makeParams = function () {
	    var params = {};

	    if (_this.limit) {
	      params.limit = _this.limit;
	    }
	    if (_this.offset) {
	      params.offset = _this.offset;
	    }

	    return params;
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtpingblogname', '{ping.blogName}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtpingdate', '{ping.date}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtpingentry', '<mtdummy each="{entry in entries}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var dataapi = __webpack_require__(1);
	  var self = this;
	  this.on('mount', function () {
	    if (!self.ping) {
	      console.log('no ping context');
	      return;
	    }

	    dataapi.client.getEntry(self.ping.blog.id, self.ping.entry.id, function (response) {
	      if (response.error) {
	        console.log(response.error);
	        return;
	      }

	      self.entries = [response];
	      self.update();
	    });
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtpingexcerpt', '{ping.excerpt}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtpingid', '{ping.id}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtpingip', '{ping.ip}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtpingtitle', '{ping.title}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtpingurl', '{ping.url}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(89);
	__webpack_require__(90);
	__webpack_require__(91);
	__webpack_require__(92);
	__webpack_require__(93);
	__webpack_require__(94);
	__webpack_require__(95);
	__webpack_require__(96);
	__webpack_require__(97);
	__webpack_require__(98);
	__webpack_require__(99);
	__webpack_require__(100);

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(9);

	riot.tag2('mtwebsites', '<mtdummy each="{website, i in websites}"><yield></yield></mtdummy>', '', '', function (opts) {
	  var dataapi = __webpack_require__(1);

	  this.websites = [];

	  var self = this;

	  this.on('mount', function () {
	    var limit = opts.limit || 25;
	    self.fetch(limit, 100, 0);
	  });

	  this.fetch = function (totalLimit, limit, offset) {
	    dataapi.client.listSites({ limit: limit, offset: offset }, function (response) {
	      if (response.error) {
	        console.log(response.error);
	        self.update();
	        return;
	      }

	      if (response.items.length === 0) {
	        self.update();
	        return;
	      }

	      for (var i = 0; i < response.items.length; i++) {
	        var item = response.items[i];
	        if (item.class === 'website') {
	          self.websites.push(item);
	        }
	      }

	      if (response.totalResults <= limit * (offset + 1) || self.websites.length >= totalLimit) {
	        while (self.websites.length > totalLimit) {
	          self.websites.pop();
	        }
	        self.update();
	        return;
	      }

	      self.fetch(totalLimit, limit, offset + limit);
	    });
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsitecclicenseimage', '{website.ccLicenseImage}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsitecclicenseurl', '{website.ccLicenceUrl}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsitedatelanguage', '{website.dateLanguage}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsitedescription', '{website.description}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsitehost', '{website.host}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsiteid', '{website.id}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsitelanguage', '{website.language}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsitename', '{website.name}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsiterelativeurl', '{website.relativeUrl}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsitetimezone', '{website.timezone}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('mtwebsiteurl', '{website.url}<yield></yield>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }
/******/ ]);