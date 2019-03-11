class jekyllSearch {
  constructor(dataSource, searchField, resultsList, siteURL, indicator) {
    this.dataSource = dataSource
    this.searchField = document.querySelector(searchField)
    this.resultsList = document.querySelector(resultsList)
    this.siteURL = siteURL
    this.indicator = indicator

    this.displayResults = this.displayResults.bind(this)
  }

  fetchedData() {
    return fetch(this.dataSource)
      .then(blob => blob.json())
  }

  async findResults() {
    const data = await this.fetchedData()
    return data.filter(item => {
      const regex = new RegExp(this.searchField.value, 'gi')
      return item.title.match(regex) || item.content.match(regex) || item.indicator.match(regex)
    })
  }

  async displayResults() {
    const results = await this.findResults()
    var allcookies = document.cookie
    if (allcookies.includes(`high`)){
        const html = results.map(item => {
          return `
            <li class="result">
                <article class="result__article  article">
                    <h4>
                      <a class="search_pl" style="color: #fff;font-size: 1.2rem;" href="${item.url}">${item.indicator +' '+ item.title}</a>
                    </h4>
                    <p>${item.excerpt}</p>
                </article>
            </li>`
        }).join('')


    if ((results.length == 0) || (this.searchField.value == '')) {


        this.resultsList.innerHTML = `<p>There is no indicator containing the searched phrase</p>`

    } else {
      this.resultsList.innerHTML = html
    }
  }else{

          const html = results.map(item => {
            return `
              <li class="result">
                  <article class="result__article  article">
                      <h4>
                        <a class="search_pl" style="font-size: 1.2rem;" href="${item.url}">${item.indicator +' '+ item.title}</a>
                      </h4>
                      <p>${item.excerpt}</p>
                  </article>
              </li>`
          }).join('')


        if ((results.length == 0) || (this.searchField.value == '')) {

          this.resultsList.innerHTML = `<p>There is no indicator containing the searched phrase</p>`

        } else {
        this.resultsList.innerHTML = html
        }

  }
}
  init() {
    const url = new URL(document.location)
    if (url.searchParams.get("search")) {
      this.searchField.value = url.searchParams.get("search")
      this.displayResults()
    }
    this.searchField.addEventListener('keyup', () => {
      this.displayResults()
      url.searchParams.set("search", this.searchField.value)
      window.history.pushState('', '', url.href)
    })
    this.searchField.addEventListener('keypress', event => {
      if (event.keyCode == 13) {
        event.preventDefault()
      }
    })
  }
}
