requirejs.config({ nodeRequire: require });

requirejs([
	'node_modules/vue/dist/vue.js',
	'node_modules/vuex/dist/vuex.js',
	'node_modules/vue-resource/dist/vue-resource.js',
	'node_modules/vue-router/dist/vue-router.min.js',
	'node_modules/marked/lib/marked.js',
	'node_modules/airtable/build/airtable.browser.js',
	], function(Vue, Vuex, VueResource, VueRouter, marked, Airtable) {

	window.Vue = Vue

	Vue.use(Vuex)
	Vue.use(VueResource)
	Vue.use(VueRouter)


	// Url routing

	var homeUrl = "actus"

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
			'links': [],
			'onboarding': {
				'status': 'inactive',
			},
			'loading': false,
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
				:href="children ? '#' : '#/'+url"
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
					:url="homeUrl"
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
			homeUrl() { return homeUrl },
		}
	})

	Vue.component('departement-selector', {
		template: `
			<select>
				<option value="" disabled selected>Choisir un département</option>
				<option>1 - Ain</option>
				<option>2 - Aisne</option>
				<option>3 - Allier</option>
				<option>4 - Alpes-de-Haute-Provence</option>
				<option>5 - Hautes-alpes</option>
				<option>6 - Alpes-maritimes</option>
				<option>7 - Ardèche</option>
				<option>8 - Ardennes</option>
				<option>9 - Ariège</option>
				<option>10 - Aube</option>
				<option>11 - Aude</option>
				<option>12 - Aveyron</option>
				<option>13 - Bouches-du-Rhône</option>
				<option>14 - Calvados</option>
				<option>15 - Cantal</option>
				<option>16 - Charente</option>
				<option>17 - Charente-maritime</option>
				<option>18 - Cher</option>
				<option>19 - Corrèze</option>
				<option>2a - Corse-du-sud</option>
				<option>2b - Haute-Corse</option>
				<option>21 - Côte-d'Or</option>
				<option>22 - Côtes-d'Armor</option>
				<option>23 - Creuse</option>
				<option>24 - Dordogne</option>
				<option>25 - Doubs</option>
				<option>26 - Drôme</option>
				<option>27 - Eure</option>
				<option>28 - Eure-et-loir</option>
				<option>29 - Finistère</option>
				<option>30 - Gard</option>
				<option>31 - Haute-garonne</option>
				<option>32 - Gers</option>
				<option>33 - Gironde</option>
				<option>34 - Hérault</option>
				<option>35 - Ille-et-vilaine</option>
				<option>36 - Indre</option>
				<option>37 - Indre-et-loire</option>
				<option>38 - Isère</option>
				<option>39 - Jura</option>
				<option>40 - Landes</option>
				<option>41 - Loir-et-cher</option>
				<option>42 - Loire</option>
				<option>43 - Haute-loire</option>
				<option>44 - Loire-atlantique</option>
				<option>45 - Loiret</option>
				<option>46 - Lot</option>
				<option>47 - Lot-et-garonne</option>
				<option>48 - Lozère</option>
				<option>49 - Maine-et-loire</option>
				<option>50 - Manche</option>
				<option>51 - Marne</option>
				<option>52 - Haute-marne</option>
				<option>53 - Mayenne</option>
				<option>54 - Meurthe-et-moselle</option>
				<option>55 - Meuse</option>
				<option>56 - Morbihan</option>
				<option>57 - Moselle</option>
				<option>58 - Nièvre</option>
				<option>59 - Nord</option>
				<option>60 - Oise</option>
				<option>61 - Orne</option>
				<option>62 - Pas-de-calais</option>
				<option>63 - Puy-de-dôme</option>
				<option>64 - Pyrénées-atlantiques</option>
				<option>65 - Hautes-Pyrénées</option>
				<option>66 - Pyrénées-orientales</option>
				<option>67 - Bas-rhin</option>
				<option>68 - Haut-rhin</option>
				<option>69 - Rhône</option>
				<option>70 - Haute-saône</option>
				<option>71 - Saône-et-loire</option>
				<option>72 - Sarthe</option>
				<option>73 - Savoie</option>
				<option>74 - Haute-savoie</option>
				<option>75 - Paris</option>
				<option>76 - Seine-maritime</option>
				<option>77 - Seine-et-marne</option>
				<option>78 - Yvelines</option>
				<option>79 - Deux-sèvres</option>
				<option>80 - Somme</option>
				<option>81 - Tarn</option>
				<option>82 - Tarn-et-garonne</option>
				<option>83 - Var</option>
				<option>84 - Vaucluse</option>
				<option>85 - Vendée</option>
				<option>86 - Vienne</option>
				<option>87 - Haute-vienne</option>
				<option>88 - Vosges</option>
				<option>89 - Yonne</option>
				<option>90 - Territoire de belfort</option>
				<option>91 - Essonne</option>
				<option>92 - Hauts-de-seine</option>
				<option>93 - Seine-Saint-Denis</option>
				<option>94 - Val-de-marne</option>
				<option>95 - Val-d'oise</option>
				<option>971 - Guadeloupe</option>
				<option>972 - Martinique</option>
				<option>973 - Guyane</option>
				<option>974 - La réunion</option>
				<option>976 - Mayotte</option>
				<option>99 - Étranger</option>
			</select>
		`,
	})



	Vue.component('onboarding-modal', {
		props: ['onboard', 'email', 'record', 'loading'],
		template: `
			<transition name="fade">
				<div class="fullscreen text">
					<div class="container">
						<form @submit.prevent="onboard(record)">
							<h2>Félicitations !</h2>
							<p>Tu peux désormais finaliser ton inscription :</p>
							<div class="form-group">
								<label>Quel est ton <strong>prénom</strong> ?</label>
								<input id="onboard__prenom" class="form-control">
							</div>
							<div class="form-group">
								<label>Quel est ton <strong>nom</strong> ?</label>
								<input id="onboard__nom" class="form-control">
							</div>
							<div class="form-group">
								<label>Quelle est ton année de <strong>naissance</strong> ?</label>
								<input id="onboard__naissance" pattern="[0-9]{4}$" class="form-control">
							</div>
							<div class="form-group">
								<label><strong>Que fais-tu</strong>, dans la vie ?</label>
								<input id="onboard__occupation" class="form-control">
								<small class="text-muted form-text">Si tu es étudiant·e, dis-nous en quoi, c'est plus intéressant !</small>
							</div>
							<div class="form-group">
								<label>Peux-tu nous confirmer ton <strong>adresse email</strong> ?</label>
								<input id="onboard__email" type="email" :value="email" class="form-control">
							</div>
							<div class="form-group">
								<label>As-tu un <strong>numéro de mobile</strong> ?</label>
								<input id="onboard__tel" class="form-control">
								<small class="text-muted form-text">Histoire qu'on puisse un peu papoter !</small>
							</div>					
							<div class="form-group">
								<label>Dans quel <strong>département</strong> habites-tu ?</label>
								<departement-selector id="onboard__departement" class="form-control"></departement-selector>
								<small class="text-muted form-text">Parce que la politique, ça se joue au local !</small>
							</div>
							<div class="form-group">
								<label>Dans quelle <strong>ville</strong> habites-tu ?</label>
								<input id="onboard__ville" class="form-control">
							</div>
							<p>
								<button id="endFormButton" class="btn btn-primary btn-block">
									<i v-if="loading" class="fa fa-spin fa-circle-o-notch"></i>
									<i v-else class="fa fa-check"></i>
									Finaliser mon inscription
								</button>
							</p>
						</form>

					</div>
			</div>
		</transition>
		`,
	})

	var Actus = {
		template: `
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
			</transition>
		`,
		computed: {
			state () { return this.$store.state },
			placeholders() { return placeholders },
		}
	}

	var Page = {
		template: `
			<section class="text">
				<transition name="fade">
					<div class="container" v-for="page in state.pages" v-if="page.fields.url==$route.params.page_slug" :key="page.sys.id">
						<h1>{{ page.fields.title }}</h1>
						<div v-html="marked(page.fields.content)"></div>
						<div class="end-of-page">
							<p>
								<a class="back-to-home btn btn-secondary" href="/#/actus">
									<i class="fa fa-undo"></i>
									Retour à l'accueil
								</a>
							</p>
						</div>
					</div>
				</transition>
			</section>
		`,
		computed: {
			state () { return this.$store.state },
			marked() { return marked },
		}
	}


	var routes = [
		{ path: '', redirect: homeUrl},
		{ path: '/'+homeUrl, component: Actus },
		{ path: '/:page_slug', component: Page },
	]
	var router = new VueRouter({
		routes,
		scrollBehavior (to, from, savedPosition) { return { x: 0, y: 0 } }
	})




	// App
	var app = new Vue({
		el: '#app',
		store,
		router,
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
									<h3>Rejoins-nous !</h3>
									<form v-if="state.onboarding.status=='inactive'" id="signup_form" @submit.prevent="signup()">
										<div class="input-group">
											<input id="signup_email" type="email" name="signup_email" placeholder="mon@adresse.mail" class="form-control">
											<div class="input-group-append">
												<button type="submit" class="btn btn-primary email-submit">
													<i v-if="state.loading" class="fa fa-spin fa-circle-o-notch"></i>
													<i v-else class="fa fa-chevron-right"></i>
												</button>
											</div>
										</div>
									</form>
									<div v-else class="alert alert-success" role="alert">
										<i class="fa fa-check"></i>
										Ton inscription a bien été enregistrée !
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="nav-wrapper">
						<main-nav :menu="state.menu" class="container"></main-nav>
					</div>
				</header>

				<transition name="fade">
					<router-view></router-view>
				</transition>

				<footer>
					<div class="container text-muted text-center small">
						<p>
							<template v-for="page in state.pages" v-if="page.fields.displayArea=='Pied de page'">
								<a :href="'#/'+page.fields.url">{{ page.fields.title }}</a><span class="link-divider"> · </span>
							</template>
						</p>
						<p>
							<template v-for="link in state.links" v-if="link.fields.displayArea=='Pied de page'">
								<a :href="link.fields.url">{{ link.fields.text }}</a><span class="link-divider"> · </span>
							</template>
						</p>
						<p>Les Jeunes Démocrates, tous droits réservés.</p>
					</div>
				</footer>

				<onboarding-modal
					v-if="state.onboarding.status=='active'"
					:onboard="onboard"
					:loading="state.loading"
					:email="state.onboarding.email"
					:record="state.onboarding.record"
				></onboarding-modal>

			</div>
	
		`,
		computed: {
			state () { return this.$store.state },
		},
		methods: {
			signup: function() {

				store.commit('updateData', { 'loading': true, })

				var email = document.querySelector('#signup_email').value
				var data = { "Email": email, }

				Vue.http.post(_airTable.ListEndpoint('Inscriptions'), {'fields': data}).then((response) => {
					store.commit('updateData', {
						'onboarding': { 'status': 'active', 'email': email, 'record': response.body.id },
						'loading': false,
					})
				})

			},
			onboard: function(record) {

				store.commit('updateData', { 'onboarding': { 'status': 'complete' }, 'loading': false, })

				var prenom = document.querySelector('#onboard__prenom').value
				var nom = document.querySelector('#onboard__nom').value
				var naissance = document.querySelector('#onboard__naissance').value
				var occupation = document.querySelector('#onboard__occupation').value

				var email = document.querySelector('#onboard__email').value
				var tel = document.querySelector('#onboard__tel').value

				var departement = document.querySelector('#onboard__departement').value
				var ville = document.querySelector('#onboard__ville').value

				data = {
					"Prénom": prenom,
					"Nom": nom,
					"Année de naissance": naissance,
					"Occupation": occupation,
					"Email": email,
					"Mobile": tel,
					"Département": departement,
					"Ville": ville,
				}

				Vue.http.patch(_airTable.ItemEndpoint('Inscriptions', record), {'fields': data}).then((response) => {
					console.log(response.body)
					store.commit('updateData', { 'onboarding': { 'status': 'complete', 'loading': false, }, })
				})


			}
		}
	})


	// DATA FETCHING

	function getThumbnail(article) {
		var articleImages = article.description.match("https:\/\/cdn-images-1.medium.com\/max\/[0-9]*\/([^.]*).(jpg|png|jpeg)")
		if (articleImages) {
			var thumbnail = articleImages[0].replace(/max\/[0-9]*/, "max/320")
			return thumbnail
		} else {
			return "media/meeting.jpg"
		}	
	}

	Vue.http.get("https://api.rss2json.com/v1/api.json?api_key=5ftufd58cwsriwlqozmec5fjliaa479brtt3dra6&rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F@JeunesDemocrates&count=6")
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

function airTable(apiKey, appKey) {

	this.apiKey = apiKey
	this.appKey = appKey

	this.ListEndpoint = function (table, params) {
		// e.g. : airTableListEndpoint('Newsletters', {'maxRecords': 1})
		var paramString = ''
		for (var param in params) {
			paramString += '&' + param + '=' + params[param]
		}
		return 'https://api.airtable.com/v0/' + this.appKey + '/' + table + '?api_key=' + this.apiKey + paramString
	}

	this.ItemEndpoint = function (table, id) {
		// e.g. : airTableItemEndpoint('Newsletters', 'recKbCev6uCTnLFdU')
		return 'https://api.airtable.com/v0/' + this.appKey + '/' + table + '/' + id + '?api_key=' + this.apiKey
	}

	this.Clean = function (object) {
		// AirTable objects have a "field" property which contains their actual data
		// This is to clean up the airtable objects
		try {
			if (object.constructor === Array) {
				for (i in object) {
					var airTableId = object[i].id
					object[i] = object[i].fields
					object[i].airTableId = airTableId
				} 
			} else {
				var airTableId = object.id
				object = object.fields
				object.airTableId = airTableId
			}
			return object
		} catch (err) {
			console.error(err.message)
			return false
		}
	}
}

var _airTable = new airTable(apiKey='keywLosZM2uL7iCRC', appKey='app2vJwzO7duiq30k')