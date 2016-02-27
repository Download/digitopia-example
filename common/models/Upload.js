var async = require('async');

module.exports = function (Upload) {
	Upload.observe('before delete', function (ctx, doneObserving) {
		var File = ctx.Model;
		Upload.find({
			where: ctx.where
		}, function (err, files) {
			async.map(files, function (file, doneDeletingS3) {
				Upload.app.models.Container.removeFile('tendr-mediapolis', file.name, function (err) {
					doneDeletingS3(err);
				});
			}, function (err, obj) {
				doneObserving(err);
			});
		});
	});
};