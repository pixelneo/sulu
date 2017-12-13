define(["jquery","text!./skeleton.html","text!./on-request.html","text!./error.html"],function(a,b,c,d){"use strict";var e={previewExpandIcon:"fa-step-backward",previewCollapseIcon:"fa-step-forward",MODE_ON_REQUEST:"on_request"},f={options:{permissions:{},mode:null,webspace:null},translations:{startLabel:"sulu.preview.start",noPreviewLabel:"sulu.preview.no-preview",changeWebspaceLabel:"sulu.preview.change-webspace",objectProviderLabel:"sulu.preview.no-object-provider",defaultsProviderLabel:"sulu.preview.no-defaults-provider"},templates:{skeleton:b,onRequest:c,error:d,defaultError:"<h2><%= message %></h2>",9900:"<h2><%= translations.objectProviderLabel %></h2>",9902:"<h2><%= translations.defaultsProviderLabel %></h2>",9907:"<h2><%= translations.changeWebspaceLabel %></h2>"}};return{defaults:f,events:{names:{setContent:{postFix:"set-content",type:"on"},updateContent:{postFix:"update-content",type:"on"},error:{postFix:"error",type:"on"},webspace:{postFix:"webspace"},render:{postFix:"render"}},namespace:"sulu.preview."},initialize:function(){this.previewExpanded=!1,this.options.mode===e.MODE_ON_REQUEST?this.renderOnRequest():this.render()},renderOnRequest:function(){this.$preview=a(this.templates.onRequest({translations:this.translations})),this.html(this.$preview)},render:function(){this.$preview=a(this.templates.skeleton({constants:e})),this.$toggler=this.$preview.find(".toggler"),this.$newWindow=this.$preview.find(".new-window"),this.html(this.$preview),this.startToolbarComponent(),this.bindCustomEvents(),this.bindDomEvents()},bindDomEvents:function(){this.$newWindow.on("click",this.openPreviewInNewWindow.bind(this)),this.$toggler.on("click",this.togglePreview.bind(this))},bindCustomEvents:function(){this.events.setContent(this.setContent.bind(this)),this.events.updateContent(this.updateContent.bind(this)),this.events.error(this.error.bind(this))},startToolbarComponent:function(){var a={displayDevices:{options:{dropdownOptions:{callback:function(a){this.changePreviewStyle(a.style)}.bind(this)}}},refresh:{options:{callback:this.refreshPreview.bind(this)}}};this.options.permissions.live&&(a.cache={options:{callback:this.sandbox.website.cacheClear}}),this.options.webspace?this.events.webspace(this.options.webspace):a.webspace={options:{dropdownOptions:{preSelectedCallback:function(a){this.events.webspace(a.id)}.bind(this),callback:function(a){this.events.webspace(a.key)}.bind(this)}}},this.sandbox.start([{name:"toolbar@husky",options:{el:this.$find(".toolbar"),instanceName:"preview",skin:"big",responsive:!0,buttons:this.sandbox.sulu.buttons.get(a)}}])},error:function(a,b){var c=this.templates.defaultError;this.templates[a]&&(c=this.templates[a]),this.setContent(this.templates.error({code:a,content:c({message:b,translations:this.translations}),translations:this.translations}))},setContent:function(a){var b=this.getPreviewDocument();b.open(),b.write(a),b.close(),this.avoidNavigate(b)},avoidNavigate:function(b){a(b).find("a").click(function(){return!1})},getContent:function(){return a(this.getPreviewDocument().documentElement).html()},updateContent:function(a){for(var b in a)a.hasOwnProperty(b)&&(-1!==b.indexOf("[")?this.handleSequence(b,a[b]):this.handleSingle(b,a[b]))},refreshPreview:function(){a(this.getPreviewDocument().documentElement).html(""),this.events.render()},changePreviewStyle:function(a){this.$preview.removeClass(this.$preview.data("sulu-preview-style")),this.$preview.addClass(a),this.$preview.data("sulu-preview-style",a)},togglePreview:function(){this.previewExpanded?(this.sandbox.emit("sulu.app.toggle-column",!1),this.sandbox.dom.removeClass(this.$toggler,e.previewCollapseIcon),this.sandbox.dom.prependClass(this.$toggler,e.previewExpandIcon),this.previewExpanded=!1):(this.sandbox.emit("sulu.app.toggle-column",!0),this.sandbox.dom.removeClass(this.$toggler,e.previewExpandIcon),this.sandbox.dom.prependClass(this.$toggler,e.previewCollapseIcon),this.previewExpanded=!0)},openPreviewInNewWindow:function(){var a=this.getContent();this.sandbox.emit("sulu.app.change-width","fixed"),this.sandbox.emit("husky.navigation.show"),this.sandbox.emit("sulu.sidebar.hide"),this.previewWindow=window.open(),this.setContent(a),this.previewWindow.onunload=function(){var a=this.getContent();this.previewWindow=null,this.sandbox.emit("sulu.sidebar.show"),this.sandbox.emit("sulu.sidebar.change-width","max"),this.setContent(a)}.bind(this)},handleSequence:function(a,b){var c,d,e=a.split(/([a-zA-Z0-9_]+|\[[a-zA-Z0-9_]+\])/).filter(Boolean),f="",g=0,h=/^\d*$/;for(c in e)d=e[c].replace("[","").replace("]",""),h.test(d)?f+=' *[rel="'+g+'"]:eq('+parseInt(d)+")":(g=d,f+=' *[property="'+d+'"]');this.handle(b,f)},handleSingle:function(a,b){var c='*[property="'+a+'"]';this.handle(b,c,function(a){for(var b=a.parentNode;null!==b.parentNode;){if(b.hasAttribute("property")&&"collection"===b.getAttribute("typeof"))return!1;b=b.parentNode}return!0})},handle:function(b,c,d){var e=0,f=a(this.getPreviewDocument()).find(c),g=[].slice.call(f);g.forEach(function(c){d&&!d(c)||(a.each(b[e],function(b,d){return"html"!==b?void a(c).attr(b,d):void(c.innerHTML=d)}),e++)})},getPreviewDocument:function(){return this.previewWindow?this.previewWindow.document:this.sandbox.dom.find("iframe",this.$preview).contents()[0]}}});