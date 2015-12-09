//参数
var util = {
  getUserInfo: function(req){
//    if( typeof req.session == 'undefined')
//      return {}
    user = req.session.user || {};
    user = { id: 8437,
            name: '刘翔宇',
            username: 'xiangyu.liu',
            loginId: -38289 }
    return user;
  },
  diffList: function(list){
    this.list = list || [];
    $this = this;
    this.insert = function(data){
      if(typeof(data) == typeof(this.list)){
        data.forEach(function(value){
          if($this.list.indexOf(value) < 0){
            //+
            if($this.afterAdd){
              $this.afterAdd(value);
            }
          }
        });
        $this.list.forEach(function(value){
          if(data.indexOf(value) < 0){
            if($this.afterMinus){
              $this.afterMinus(value);
            }
          }
        });
        this.list = data;
      }else{
        console.log("please insert list");
      }
    }
  },
	setTimer: function(dict_list, object){
		if(!object || !object.id){
			console.log("invalid object");
			return "invalid object";
		}
		// console.log("object",object);
		dict_list.object_dict = dict_list.object_dict || {};
		dict_list.timer_dict = dict_list.timer_dict || {};
		if(!dict_list.object_dict.hasOwnProperty(object.id)){
			dict_list.object_dict[object.id] = object;
			dict_list.timer_dict[object.id] = setTimeout(function(){
				if(dict_list.timer_dict.hasOwnProperty(object.id)){
					clearTimeout(dict_list.timer_dict[object.id]);
					delete dict_list.object_dict[object.id];
					delete dict_list.timer_dict[object.id];
					this.onDestroy ? this.onDestroy() : null;
				}
			}.bind(this),this.delaytime || 1000);
			this.onCreate ? this.onCreate() : null;
		}else{
			if(dict_list.timer_dict.hasOwnProperty(object.id)){
				clearTimeout(dict_list.timer_dict[object.id]);
				delete dict_list.object_dict[object.id]; 
				delete dict_list.timer_dict[object.id];
			}
			dict_list.object_dict[object.id] = object;
			dict_list.timer_dict[object.id] = setTimeout(function(){
				if(dict_list.timer_dict.hasOwnProperty(object.id)){
					clearTimeout(dict_list.timer_dict[object.id]);
					delete dict_list.object_dict[object.id];
					delete dict_list.timer_dict[object.id];
					this.onDestroy ? this.onDestroy() : null;
				}
			}.bind(this),this.delaytime || 1000);
		}
	},
  clearTimer: function(id, dict_list){
    if(dict_list.hasOwnProperty("object_dict")){
      delete dict_list.object_dict[id];
    }
    if(dict_list.hasOwnProperty("timer_dict")){
      clearTimeout(dict_list.timer_dict[id]);
      delete dict_list.timer_dict[id];
    }
  },
	mixin: function (obj, props) {
		for (var key in props) {
			if (props.hasOwnProperty(key)) {
				obj[key] = props[key];
			}
		}
		return obj;
	},
	expand: function(srcObj, props) {
		var func = function() {}
		Utils.mixin(func.prototype, srcObj);
		var newObj = new func();
		Utils.mixin(newObj, props);
		return newObj;
	},
	declare: function(protos) {
		var clazz = function() {
			if (this.init) {
				this.init.apply(this, arguments);
			}
		}

		Utils.mixin(clazz.prototype, protos);
		return clazz;
	},
	hitch: function(scope, method) {
		if (Utils.isString(method)) {
			if (!scope[method]) {
				throw(['hitch: ', scope, '[', method , '] is null'].join(''));
			}
			return function() {
				return scope[method].apply(scope, arguments || []);
			}
		}
		return function () {
			return method.apply(scope, arguments || []);
		}
	},
	isString: function(val) {
		return (typeof val == 'string' || val instanceof String);
	},
	dumpBuffer: function(buf) {
		var res = [];
		for (var i = 0; i != buf.length; ++i) {
			res.push(buf[i]);
		}
		console.log(res.join(', '));
	},
  ObjectToArray: function(list, Object){
    for(var key in Object){
      if(Object.hasOwnProperty(key)){
        list = list.concat([key, Object[key]]);
      }
    }
    return list;
  }
}

util.mixin(exports,util);
// var project = {delaytime:2000};
// util.setTimer.apply(project,[{id:"hello"}]);
// util.setTimer.apply(project,[{id:"hello"}]);
// util.setTimer.apply(project,[{id:"world"}]);
