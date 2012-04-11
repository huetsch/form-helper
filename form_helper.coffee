require 'cream'
TagHelper = require 'tag-helper'
InstanceTag = require 'instance-tag'
FormTagHelper = require 'form-tag-helper'

class FormHelper
  label: (object_name, method, content_or_options = null, options = null, block) =>
    content_is_options = Object.isPlainObject(content_or_options)
    if content_is_options or block
      options = content_or_options if content_is_options
      text = null
    else
      text = content_or_options

    options ||= {}
    InstanceTag.new(object_name, method, @, Object.delete(options,'object')).to_label_tag(text, options, block)

InstanceTag::tag_name = ->
  "#{@object_name}[#{@sanitized_method_name()}]"

InstanceTag::tag_name_with_index = (index) ->
  "#{@object_name}[#{index}][#{@get_sanitized_method_name()}]"

InstanceTag::tag_id = ->
  "#{sanitized_object_name}_#{@get_sanitized_method_name()}"

InstanceTag::tag_id_with_index = (index) ->
  "#{@sanitized_object_name()}_#{index}_#{@get_sanitized_method_name()}"

InstanceTag::get_sanitized_object_name = ->
  @sanitized_object_name ||= @object_name.replace(/\]\[|[^-a-zA-Z0-9:.]/g, "_").replace(/_$/, "")

InstanceTag::get_sanitized_method_name = ->
  @sanitized_method_name ||= @method_name.replace(/\?$/,"")

InstanceTag::add_default_name_and_id = (options) ->
  if options.index?
    options["name"] ||= @tag_name_with_index(options["index"])
    options["id"] = if options.id? then options.id else @tag_id_with_index(options["index"])
    Object.delete options, "index"
  else if @auto_index?
    options["name"] ||= @tag_name_with_index(@auto_index)
    options["id"] = if options.id? then options.id else @tag_id_with_index(@auto_index)
  else
    options["name"] ||= @tag_name() + (if options['multiple'] then '[]' else '')
    options["id"] = if options.id? then options.id else @tag_id()
  options["id"] = [Object.delete(options, 'namespace'), options["id"]].compact().join("_")
  if options["id"].length is 0
    options["id"] = null

InstanceTag::add_default_name_and_id_for_value = (tag_value, options) ->
  if tag_value
    pretty_tag_value = tag_value.replace(/\s/g, "_").replace(/[^-\w]/g, "").toLowerCase()
    specified_id = options["id"]
    @add_default_name_and_id(options)
    options["id"] += "_#{pretty_tag_value}" if specified_id?.trim().length is 0 and options.id?
  else
    @add_default_name_and_id(options)

InstanceTag::to_label_tag = (text = null, options = {}, block) ->
  tag_value = Object.delete options, "value"
  name_and_id = Object.clone options

  if name_and_id["for"]
    name_and_id["id"] = name_and_id["for"]
  else
    Object.delete name_and_id, "id"

  @add_default_name_and_id_for_value(tag_value, name_and_id)
  Object.delete options, "index"
  Object.delete options, "namespace"
  options["for"] ||= name_and_id["id"]

  if block
    # XXX unimplemented
    #@template_object.label_tag(name_and_id["id"], options, &block)
    throw new Error("passing a block to_label_tag has not been implemented yet")
  else
    content = if text.trim().length is 0
      @object_name = @object_name.replace(/\[(.*)_attributes\]\[\d\]/g, '.\1')
      method_and_value = if tag_value? then "#{@method_name}.#{tag_value}" else @method_name

      # XXX unimplemented
      #if object.respond_to?(:to_model)
      #  key = object.class.model_name.i18n_key
      #  i18n_default = ["#{key}.#{method_and_value}".to_sym, ""]
      #end

      #i18n_default ||= ""
      #I18n.t("#{object_name}.#{method_and_value}", :default => i18n_default, :scope => "helpers.label").presence
    else
      text

    # XXX unimplemented
    #content ||= if @object && object.class.respond_to?(:human_attribute_name)
    #  object.class.human_attribute_name(method_name)

    content ||= @method_name.humanize()

    FormTagHelper.label_tag(name_and_id["id"], content, options)
