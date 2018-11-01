// (function(root, factory) {
//   if (typeof define === "function" && define.amd) {
//     // AMD. Register as an anonymous module unless amdModuleId is set
//     define("simple-module", ["jquery"], function(a0) {
//       return (root["Module"] = factory(a0));
//     });
//   } else if (typeof exports === "object") {
//     // Node. Does not work with strict CommonJS, but
//     // only CommonJS-like environments that support module.exports,
//     // like Node.
//     module.exports = factory(require("jquery"));
//   } else {
//     root["SimpleModule"] = factory(jQuery);
//   }
//   // @ts-ignore;
// })(this, function($) {
//   var Module,
//     slice = [].slice;
//   Module = (function() {
//     function Module(this: any, opts: any) {
//       var base, cls, i, instance, instances, len, name;
//       this.opts = $.extend({}, this.opts, opts);
//       (base = this.constructor)._connectedClasses ||
//         (base._connectedClasses = []);
//       instances = function(this: any) {
//         var i, len, ref, results;
//         ref = this.constructor._connectedClasses;
//         results = [];
//         for (i = 0, len = ref.length; i < len; i++) {
//           cls = ref[i];
//           name =
//             cls.pluginName.charAt(0).toLowerCase() + cls.pluginName.slice(1);
//           if (cls.prototype._connected) {
//             cls.prototype._module = this;
//           }
//           results.push((this[name] = new cls()));
//         }
//         return results;
//       }.call(this);
//       if (this._connected) {
//         this.opts = $.extend({}, this.opts, this._module.opts);
//       } else {
//         this._init();
//         for (i = 0, len = instances.length; i < len; i++) {
//           instance = instances[i];
//           if (typeof instance._init === "function") {
//             instance._init();
//           }
//         }
//       }
//       this.trigger("initialized");
//     }
//     Module.extend = function(obj) {
//       var key, ref, val;
//       if (!(obj != null && typeof obj === "object")) {
//         return;
//       }
//       for (key in obj) {
//         val = obj[key];
//         if (key !== "included" && key !== "extended") {
//           this[key] = val;
//         }
//       }
//       return (ref = obj.extended) != null ? ref.call(this) : void 0;
//     };

//     Module.include = function(obj) {
//       var key, ref, val;
//       if (!(obj != null && typeof obj === "object")) {
//         return;
//       }
//       for (key in obj) {
//         val = obj[key];
//         if (key !== "included" && key !== "extended") {
//           this.prototype[key] = val;
//         }
//       }
//       return (ref = obj.included) != null ? ref.call(this) : void 0;
//     };

//     Module.connect = function(cls) {
//       if (typeof cls !== "function") {
//         return;
//       }
//       if (!cls.pluginName) {
//         throw new Error(
//           "Module.connect: cannot connect plugin without pluginName"
//         );
//         return;
//       }
//       cls.prototype._connected = true;
//       if (!this._connectedClasses) {
//         this._connectedClasses = [];
//       }
//       this._connectedClasses.push(cls);
//       if (cls.pluginName) {
//         return (this[cls.pluginName] = cls);
//       }
//     };
//     Module._t = function() {
//       var args, key, ref, result;
//       (key = arguments[0]),
//         (args = 2 <= arguments.length ? slice.call(arguments, 1) : []);
//       result =
//         ((ref = this.i18n[this.locale]) != null ? ref[key] : void 0) || "";
//       if (!(args.length > 0)) {
//         return result;
//       }
//       result = result.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(
//         p0,
//         p,
//         position
//       ) {
//         if (position) {
//           return p + args[parseInt(position) - 1];
//         } else {
//           return p + args.shift();
//         }
//       });
//       return result.replace(/%%s/g, "%s");
//     };

//     Module.i18n = {
//       "zh-CN": {},
//     };

//     Module.locale = "zh-CN";

//     return Module;
//   })();

//   return Module;
// });

// const slice = [].slice;

// class Module {
//   opts = {};
//     _init () {};
//     on () {
//       var args, ref;
//       args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
//       (ref = $(this)).on.apply(ref, args);
//       return this;
//     };
//     one () {
//       var args, ref;
//       args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
//       (ref = $(this)).one.apply(ref, args);
//       return this;
//     };

//     off () {
//       var args, ref;
//       args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
//       (ref = $(this)).off.apply(ref, args);
//       return this;
//     };

//     trigger () {
//       var args, ref;
//       args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
//       (ref = $(this)).trigger.apply(ref, args);
//       return this;
//     };

//     triggerHandler () {
//       var args, ref;
//       args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
//       return (ref = $(this)).triggerHandler.apply(ref, args);
//     };

//     _t () {
//       var args, ref;
//       args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
//       return (ref = this.constructor)._t.apply(ref, args);
//     };
// }
