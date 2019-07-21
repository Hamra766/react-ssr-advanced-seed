interface IDataValues {
	_links: {
		self: {
			href: string;
		};
		previousepisode: {
			href: string;
		};
	};
}

export class TvMazeService {
	static transformProxyData(proxyResData: string) {
		const data = JSON.parse(proxyResData); // 'utf8'
		if (data.length) {
			data.map((values: IDataValues) => {
				values._links.self.href = values._links.self.href.replace(
					'api.tvmaze.com',
					`localhost:${process.env.PORT}/proxy`
				);
				values._links.previousepisode.href = values._links.previousepisode.href.replace(
					'api.tvmaze.com',
					`localhost:${process.env.PORT}/proxy`
				);
				return values;
			});
		} else {
			data._links.self.href = data._links.self.href.replace(
				'api.tvmaze.com',
				`localhost:${process.env.PORT}/proxy`
			);
			if (
				data &&
				data._links &&
				data._links.previousepisode &&
				data._links.previousepisode.href
			) {
				data._links.previousepisode.href = data._links.previousepisode.href.replace(
					'api.tvmaze.com',
					`localhost:${process.env.PORT}/proxy`
				);
			}
		}

		return JSON.stringify(data);
	}
}
