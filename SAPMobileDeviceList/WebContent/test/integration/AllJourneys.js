jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"be/infra/sap/mobile/devicelist/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"be/infra/sap/mobile/devicelist/test/integration/pages/Worklist",
		"be/infra/sap/mobile/devicelist/test/integration/pages/Object",
		"be/infra/sap/mobile/devicelist/test/integration/pages/NotFound",
		"be/infra/sap/mobile/devicelist/test/integration/pages/Browser",
		"be/infra/sap/mobile/devicelist/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "be.infra.sap.mobile.devicelist.view."
	});

	sap.ui.require([
		"be/infra/sap/mobile/devicelist/test/integration/WorklistJourney",
		"be/infra/sap/mobile/devicelist/test/integration/ObjectJourney",
		"be/infra/sap/mobile/devicelist/test/integration/NavigationJourney",
		"be/infra/sap/mobile/devicelist/test/integration/NotFoundJourney",
		"be/infra/sap/mobile/devicelist/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});
