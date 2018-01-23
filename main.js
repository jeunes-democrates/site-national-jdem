requirejs.config({ nodeRequire: require });

requirejs([
	'node_modules/vue/dist/vue.js',
	'node_modules/vuex/dist/vuex.js',
	'node_modules/vue-resource/dist/vue-resource.js',
	'node_modules/vue-router/dist/vue-router.min.js'
	], function(Vue, Vuex, VueResource, VueRouter) {

	Vue.use(Vuex)
	Vue.use(VueResource)
	Vue.use(VueRouter)

	// Placeholders

	window.placeholders = {
		'articles' : [
			{ "placeholder" : true },
			{ "placeholder" : true },
			{ "placeholder" : true },
			{ "placeholder" : true },
			{ "placeholder" : true },
			{ "placeholder" : true }
		]
	}

	// Store
	window.store = new Vuex.Store({
		state: {
			'meta' : {
				'name' : "Les Jeunes Démocrates"
			},
			'articles': placeholders.articles,
			'pages': [],
			'links': []
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]
				}
			}
		}
	})

	//	, "children" : [
	//		{ "name" : "Actus & idées", "url" : "#" },
	//		{ "name" : "Equipe nationale", "url" : "#" },
	//		{ "name" : "Missions à pourvoir", "url" : "#" },
	//		{ "name" : "Statuts et textes", "url" : "#" }
	//	]

		

	// COMPONENTS

	Vue.component('article-block', {
		props: ['articles', 'title', 'slug', 'url'],
		template: `
			<div class="articleWall">
				<h2 :id="slug">{{ title }}</h2>
				<div class="articleWall__wrapper">
					<template v-for="article in articles">
						<a class="articleWall__anchor" :href="article.link" target="_blank">
							<div class="articleWall__illustration" :style="{ backgroundImage: 'url(' + article.thumbnail + ')' }"></div>
							<div class="articleWall__loader"><i class="fa fa-circle-o-notch fa-spin fa-3x"></i></div>
							<div class="articleWall__title">{{ article.title }}</div>
						</a>
					</template>
				</div>
				<p class="allnews">
					<a :href="url" target="_blank">
						<i class="fa fa-plus"></i> Voir toutes les actus
					</a>
				</p>
			</div>
		`
	})

	Vue.component('dropdown-children', {
		props: ['children'],
		template: `
			<div class="dropdown-menu">
				<a v-for="link in children" class="dropdown-item" :href="link.url">
					{{ link.name }}
				</a>
			</div>
		`
	})

	Vue.component('nav-icon-link', {
		props: ['title', 'icon', 'url', 'children', ],
		template: `
			<a
				:title="title"
				:href="children ? '#' : url"
				:data-toggle="children ? 'dropdown' : ''"
				:class="{
					'nav-link': true,
					'nav-icon-link': true,
					'dropdown-toggle': children
					}"
				target="_blank"
				>
				<i :class="getIconClass()"></i>
			</a>
		`,
		methods:{
			getIconClass() { return "fa fa-lg fa-" + this.icon }
		}
	})

	Vue.component('nav-text-link', {
		props: ['text', 'url', 'children', ],
		template: `
			<a
				:href="children ? '#' : url"
				:data-toggle="children ? 'dropdown' : ''"
				:class="{
					'nav-link': true,
					'nav-text-link': true,
					'dropdown-toggle': children
					}"
				>{{ text }}
			</a>
		`
	})

	Vue.component('main-nav', {
		props: ['menu'],
		template: `
			<nav>
				<nav-text-link
					:text="'Accueil'"
					:url="'/'"
					></nav-text-link>
				<template v-for="page in state.pages" v-if="page.fields.displayArea=='Barre de navigation'">
					<nav-text-link
						:text="page.fields.title"
						:url="page.fields.url"
						></nav-text-link>
				</template>
				<template v-for="link in state.links" v-if="link.fields.displayArea=='Barre de navigation'">
					<nav-icon-link v-if="link.fields.icon"
						:title="link.fields.text"
						:icon="link.fields.icon"
						:url="link.fields.url"
						></nav-icon-link>
					<nav-text-link v-else
						:text="link.fields.text"
						:url="link.fields.url"
						></nav-text-link>
				</template>
			</nav>
		`,
		computed: {
			state () { return this.$store.state },
			placeholders() { return placeholders },
		}
	})


	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div id="app" lang="fr">

				<header>
					<div class="top-background">
						<div class="container">
							<div class="row header-wrapper">
								<div class="col-md-6 header-item">
									<h1>
										<img class="title__image" src="media/long-logo-white.svg" :alt="state.meta.name" />
									</h1>
								</div>
								<div class="col-md-6 col-lg-5 offset-lg-1 header-item email-wrapper">
									<h2>Rejoins-nous !</h2>
									<form>
										<div class="input-group">
											<input type="email" placeholder="mon@adresse.mail" class="form-control form-control-lg">
											<div class="input-group-append">
												<button type="submit" class="btn btn-lg btn-primary email-submit"><i class="fa fa-chevron-right"></i></button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
					<div class="nav-wrapper">
						<main-nav :menu="state.menu" class="container"></main-nav>
					</div>
				</header>

				<section>
					<article-block
						:articles="state.articles"
						:title="'Nos idées & actualités'"
						:slug="'actus'"
						:url="'https://medium.com/133b'"
						class="container"
						:class="{ loading: (state.articles==placeholders.articles) }"
						></article-block>
				</section>

				<footer>
					<div class="container text-muted text-center small">
						<p>
							<template v-for="page in state.pages" v-if="page.fields.displayArea=='Pied de page'">
								<a href="#">{{ page.fields.title }}</a><span class="link-divider"> · </span>
							</template>
						</p>
						<p>
							<template v-for="link in state.links" v-if="link.fields.displayArea=='Pied de page'">
								<a href="#">{{ link.fields.text }}</a><span class="link-divider"> · </span>
							</template>
						</p>
						<p>Les Jeunes Démocrates, tous droits réservés.</p>
					</div>
				</footer>

			</div>
	
		`,
		computed: {
			state () { return this.$store.state },
			placeholders() { return placeholders },
		}
	})


	// DATA FETCHING

	function getThumbnail(article) {
		var articleImages = article.description.match("https:\/\/cdn-images-1.medium.com\/max\/960\/([^.]*).(jpg|png|jpeg)")
		if (articleImages) {
			var thumbnail = articleImages[0].replace("/960/", "/320/")
			return thumbnail
		} else {
			return "media/meeting.jpg"
		}	
	}

	Vue.http.get("https://api.rss2json.com/v1/api.json?api_key=5ftufd58cwsriwlqozmec5fjliaa479brtt3dra6&rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F133b&count=6")
	.then((response) => {
		var actus = response.body.items
		for (i in actus) {
			actus[i].thumbnail = getThumbnail(actus[i])
		}
		store.commit('updateData', {'articles': actus})
	})

	Vue.http.get("https://cdn.contentful.com/spaces/9anjgb8uaow7/entries?content_type=page&order=-fields.importance&access_token=d58efc31e918032547e317714c2ad771b2279bfd18d5260573d3372915f549aa")
	.then((response) => {
		store.commit('updateData', {'pages': response.body.items})
	})

	Vue.http.get("https://cdn.contentful.com/spaces/9anjgb8uaow7/entries?content_type=link&order=-fields.importance&access_token=d58efc31e918032547e317714c2ad771b2279bfd18d5260573d3372915f549aa")
	.then((response) => {
		store.commit('updateData', {'links': response.body.items})
	})


})
