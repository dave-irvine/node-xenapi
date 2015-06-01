// Generated by CoffeeScript 1.9.1
(function() {
  var Pool, Promise, debug,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  debug = require('debug')('XenAPI:Pool');

  Promise = require('bluebird');

  Pool = (function() {
    var session, xenAPI;

    session = void 0;

    xenAPI = void 0;


    /**
    * Construct Pool
    * @class
    * @param      {Object}   session - An instance of Session
    * @param      {Object}   pool - A JSON object representing this Pool
    * @param      {String}   opaqueRef - The OpaqueRef handle to this Pool
    * @param      {Object}   xenAPI - An instance of XenAPI
     */

    function Pool(_session, _pool, _opaqueRef, _xenAPI) {
      this.getDefaultSR = bind(this.getDefaultSR, this);
      debug("constructor()");
      debug(_pool);
      if (!_session) {
        throw Error("Must provide `session`");
      }
      if (!_pool) {
        throw Error("Must provide `pool`");
      }
      if (!_opaqueRef) {
        throw Error("Must provide `opaqueRef`");
      }
      if (!_xenAPI) {
        throw Error("Must provide `xenAPI`");
      }
      session = _session;
      xenAPI = _xenAPI;
      this.opaqueRef = _opaqueRef;
      this.uuid = _pool.uuid;
      this.name = _pool.name_label;
      this.description = _pool.name_description;
    }

    Pool.prototype.getDefaultSR = function() {
      debug("getDefaultSR()");
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return session.request("pool.get_default_SR", [_this.opaqueRef]).then(function(value) {
            if (!value) {
              reject();
            }
            return xenAPI.srCollection.findOpaqueRef(value).then(function(sr) {
              return resolve(sr);
            })["catch"](function(e) {
              debug(e);
              if (e[0] === "HANDLE_INVALID") {
                return reject(new Error("Xen reported default SR, but none found. Is one set as default?"));
              } else {
                return reject(e);
              }
            });
          })["catch"](function(e) {
            debug(e);
            return reject(e);
          });
        };
      })(this));
    };

    return Pool;

  })();

  module.exports = Pool;

}).call(this);