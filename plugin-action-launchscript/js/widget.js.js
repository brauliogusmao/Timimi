/*\
title: $:/plugins/tesseract/action-launchscript/action-launchscript-widget.js
type: application/javascript
module-type: widget

Action widget to launch scripts from standalone  HTML

\*/
(function() {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  var Widget = require("$:/core/modules/widgets/widget.js").widget;

  var LaunchScriptWidget = function(parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  };

  /*
Inherit from the base widget class
*/
  LaunchScriptWidget.prototype = new Widget();

  /*
Render this widget into the DOM
*/
  LaunchScriptWidget.prototype.render = function(parent, nextSibling) {
    this.computeAttributes();
    this.execute();
  };

  /*
Compute the internal state of the widget
*/
  LaunchScriptWidget.prototype.execute = function() {
    this.actionScript = this.getAttribute("$script");
    this.actionParam = this.getAttribute("$param");
    this.actionStdin = this.getAttribute("$stdin");
    this.actionBaseTitle = this.getAttribute("$basetitle");
    this.actionSep = this.getAttribute("$sep");
    this.actionTimestamp = this.getAttribute("$timestamp", "yes") === "yes";
  };

  /*
Refresh the widget by ensuring our attributes are up to date
*/
  LaunchScriptWidget.prototype.refresh = function(changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if ($tw.utils.count(changedAttributes) > 0) {
      this.refreshSelf();
      return true;
    }
    return this.refreshChildren(changedTiddlers);
  };

  /*
Invoke the action associated with this widget
*/
  LaunchScriptWidget.prototype.invokeAction = function(
    triggeringWidget,
    event
  ) {
    var messageBox = document.getElementById("tiddlyfox-message-box");
    var message = document.createElement("div");
    messageBox.appendChild(message);

    var title = this.wiki.generateNewTitle(this.actionBaseTitle),
      fields = {},
      creationFields,
      modificationFields;

    $tw.utils.each(this.attributes, function(attribute, name) {
      if (name.charAt(0) !== "$") {
        fields[name] = attribute;
      }
    });
    if (this.actionTimestamp) {
      creationFields = this.wiki.getCreationFields();
      modificationFields = this.wiki.getModificationFields();
    }
    var eventDetail = {
      escript: this.actionScript,
      eparam: this.actionParam,
      estdin: this.actionStdin,
      title: title,
      sep: this.actionSep,
      fields: fields,
      creationFields: creationFields,
      modificationFields: modificationFields
    };
    var event = new CustomEvent("timimi-action-launch", {
      detail: eventDetail,
      bubbles: true,
      cancelable: true
    });
    message.dispatchEvent(event);

    console.log("Event dispatched");

    return true; // Action was invoked
  };

  exports["action-launchscript"] = LaunchScriptWidget;
})();