import { format_usd } from "../helpers.js";

class PreviewConstructor {
    static internationalNumberFormat = new Intl.NumberFormat('en-US')

    constructor(variables, document) {
        this.variables = variables;
        this.document = document;
    }

    create_campaign_preview() {
        var expiration = this.variables.expiration ? "Expires: " + this.variables.expiration : ""
        var budget = this.variables.budget ? format_usd(this.variables.budget) : ""
        var about = this.variables.about ? this.variables.about.slice(0, 150) + (this.variables.about.length > 150 ? "..." : "") : ""
        var requires_approval = this.variables.requires_approval == 'yes' ? "<div class='requires-approval'><img class = 'requirement-icon' src='../assets/img/requires_approval_icon.png'/> Requires Approval</div>" : ""
        var sends_product = this.variables.requires_product == 'yes' ? "<div class='sends-product'><img class = 'requirement-icon' src='../assets/img/sends_product_icon.png'/> Sends Product</div>" : ""
        var max_payout = parseInt(this.variables.max_payout) > 0 ? "<div class='preview-row'>Max Payout: $" + PreviewConstructor.internationalNumberFormat.format(this.variables.max_payout)+"</div>" : ""
        var gender = this.variables.gender.length > 0 ? "Gender: " + this.variables.gender : ""
        var age = this.variables.age.length > 0 ? "Age: " + this.variables.age : ""
        var regions = this.variables.regions.length > 0 ? "Regions: " + this.variables.regions : ""
        var campaign_preview = `
        <div class="content-container-preview">
            <div class="banner-image-preview">
                <img src="${this.variables.primary_image.filename}"/>
            </div>
            <div class="text-content-preview">
                <div class="brand-name-preview feed-h1-preview">${this.variables.title}</div>
                <div class="description-preview">${about}</div>
                <div class="url-preview">
                    <a href="#">${this.variables.url}</a>
                </div>
                <div class="expirations-preview">
                    <div class="timestamp-preview">${expiration}</div>
                    <div class="budget-preview">
                        <div class="remaining_amount-preview">${budget}</div>
                    </div>
                </div>
                <div class="preview-row">
                    ${requires_approval}
                    ${sends_product}
                </div>
                ${max_payout}
            </div>
        </div>`
        this.document.getElementsByClassName("feed-campaign-preview")[0].innerHTML = campaign_preview
    }

    create_listeners() {
        var self = this;
        $(this.document).on("input", "input", function(){
            self.create_campaign_preview()
        })
        $(this.document).on("change", "input", function(){
            self.create_campaign_preview()
        })
        $(this.document).on("change", "select", function(){
            self.create_campaign_preview()
        })
        $(this.document).on("change", "textarea", function(){
            self.create_campaign_preview()
        })
    }
    
}

export {PreviewConstructor}
