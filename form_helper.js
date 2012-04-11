(function() {
  var FormHelper, FormTagHelper, InstanceTag, TagHelper,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require('cream');

  TagHelper = require('tag-helper');

  InstanceTag = require('instance-tag');

  FormTagHelper = require('form-tag-helper');

  FormHelper = (function() {

    function FormHelper() {
      this.label = __bind(this.label, this);
    }

    FormHelper.prototype.label = function(object_name, method, content_or_options, options, block) {
      var content_is_options, text;
      if (content_or_options == null) content_or_options = null;
      if (options == null) options = null;
      content_is_options = Object.isPlainObject(content_or_options);
      if (content_is_options || block) {
        if (content_is_options) options = content_or_options;
        text = null;
      } else {
        text = content_or_options;
      }
      options || (options = {});
      return InstanceTag["new"](object_name, method, this, Object["delete"](options, 'object')).to_label_tag(text, options, block);
    };

    return FormHelper;

  })();

  InstanceTag.prototype.tag_name = function() {
    return "" + this.object_name + "[" + (this.sanitized_method_name()) + "]";
  };

  InstanceTag.prototype.tag_name_with_index = function(index) {
    return "" + this.object_name + "[" + index + "][" + (this.get_sanitized_method_name()) + "]";
  };

  InstanceTag.prototype.tag_id = function() {
    return "" + sanitized_object_name + "_" + (this.get_sanitized_method_name());
  };

  InstanceTag.prototype.tag_id_with_index = function(index) {
    return "" + (this.sanitized_object_name()) + "_" + index + "_" + (this.get_sanitized_method_name());
  };

  InstanceTag.prototype.get_sanitized_object_name = function() {
    return this.sanitized_object_name || (this.sanitized_object_name = this.object_name.replace(/\]\[|[^-a-zA-Z0-9:.]/g, "_").replace(/_$/, ""));
  };

  InstanceTag.prototype.get_sanitized_method_name = function() {
    return this.sanitized_method_name || (this.sanitized_method_name = this.method_name.replace(/\?$/, ""));
  };

  InstanceTag.prototype.add_default_name_and_id = function(options) {
    if (options.index != null) {
      options["name"] || (options["name"] = this.tag_name_with_index(options["index"]));
      options["id"] = options.id != null ? options.id : this.tag_id_with_index(options["index"]);
      Object["delete"](options, "index");
    } else if (this.auto_index != null) {
      options["name"] || (options["name"] = this.tag_name_with_index(this.auto_index));
      options["id"] = options.id != null ? options.id : this.tag_id_with_index(this.auto_index);
    } else {
      options["name"] || (options["name"] = this.tag_name() + (options['multiple'] ? '[]' : ''));
      options["id"] = options.id != null ? options.id : this.tag_id();
    }
    options["id"] = [Object["delete"](options, 'namespace'), options["id"]].compact().join("_");
    if (options["id"].length === 0) return options["id"] = null;
  };

  InstanceTag.prototype.add_default_name_and_id_for_value = function(tag_value, options) {
    var pretty_tag_value, specified_id;
    if (tag_value) {
      pretty_tag_value = tag_value.replace(/\s/g, "_").replace(/[^-\w]/g, "").toLowerCase();
      specified_id = options["id"];
      this.add_default_name_and_id(options);
      if ((specified_id != null ? specified_id.trim().length : void 0) === 0 && (options.id != null)) {
        return options["id"] += "_" + pretty_tag_value;
      }
    } else {
      return this.add_default_name_and_id(options);
    }
  };

  InstanceTag.prototype.to_label_tag = function(text, options, block) {
    var content, method_and_value, name_and_id, tag_value;
    if (text == null) text = null;
    if (options == null) options = {};
    tag_value = Object["delete"](options, "value");
    name_and_id = Object.clone(options);
    if (name_and_id["for"]) {
      name_and_id["id"] = name_and_id["for"];
    } else {
      Object["delete"](name_and_id, "id");
    }
    this.add_default_name_and_id_for_value(tag_value, name_and_id);
    Object["delete"](options, "index");
    Object["delete"](options, "namespace");
    options["for"] || (options["for"] = name_and_id["id"]);
    if (block) {
      throw new Error("passing a block to_label_tag has not been implemented yet");
    } else {
      content = text.trim().length === 0 ? (this.object_name = this.object_name.replace(/\[(.*)_attributes\]\[\d\]/g, '.\1'), method_and_value = tag_value != null ? "" + this.method_name + "." + tag_value : this.method_name) : text;
      content || (content = this.method_name.humanize());
      return FormTagHelper.label_tag(name_and_id["id"], content, options);
    }
  };

}).call(this);
