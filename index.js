const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'climate.nasa',
        address: 'https://climate.nasa.gov/',
        base: ''
    },
    {
        name: 'nrdc',
        address: 'https://www.nrdc.org/stories/global-climate-change-what-you-need-know',
        base: ''
    },
    {
        name: 'epa',
        address: 'https://www.epa.gov/climate-change',
        base: ''
    },
    {
        name: 'europa',
        address: 'https://ec.europa.eu/clima/climate-change/causes-climate-change_en',
        base: ''
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/section/climate',
        base: ''
    },
    {
        name: 'nationalgeographic',
        address: 'https://www.nationalgeographic.org/encyclopedia/climate-change/',
        base: ''
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/specials/world/cnn-climate',
        base: ''
    },
    {
        name: 'science',
        address: 'https://www.science.org.au/learning/general-audience/science-climate-change/1-what-is-climate-change',
        base: ''
    },
    {
        name: 'theconversation',
        address: 'https://theconversation.com/uk/topics/climate-change-27',
        base: ''
    },
    {
        name: 'economist',
        address: 'https://www.economist.com/climate-change',
        base: ''
    },
    {
        name: 'worldwildlife',
        address: 'https://www.worldwildlife.org/threats/effects-of-climate-change',
        base: ''
    },
    {
        name: 'acciona',
        address: 'https://www.acciona.com./climate-change/',
        base: ''
    },
    {
        name: 'worldbank',
        address: 'https://www.worldbank.org/en/topic/climatechange',
        base: ''
    },
    {
        name: 'nature',
        address: 'https://www.nature.com/articles/d41586-021-02862-3',
        base: ''
    },
    {
        name: 'public',
        address: 'https://public.wmo.int/en/media/press-release/climate-change-and-impacts-accelerate',
        base: ''
    },
    {
        name: 'ipcc',
        address: 'https://www.ipcc.ch/',
        base: ''
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/science-environment-24021772',
        base: ''
    },
    {
        name: 'un',
        address: 'https://www.un.org/en/climatechange/what-is-climate-change',
        base: ''
    },
    {
        name: 'wmo',
        address: 'https://public.wmo.int/en/media/press-release/climate-change-and-impacts-accelerate#:~:text=There%20is%20a%2040%25%20chance,warmer%20than%20pre%2Dindustrial%20levels.',
        base: ''
    },
    {
        name: 'vox',
        address: 'https://www.vox.com/22620706/climate-change-ipcc-report-2021-ssp-scenario-future-warming',
        base: '',
    },
    {
        name: 'wikipedia',
        address: 'https://en.wikipedia.org/wiki/2021_in_climate_change',
        base: '',
    },
    /*{
        name: '',
        address: '',
        base: '',
    },
    {
        name: '',
        address: '',
        base: '',
    },
    {
        name: '',
        address: '',
        base: '',
    },*/
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
