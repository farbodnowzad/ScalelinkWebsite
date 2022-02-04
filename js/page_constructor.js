class PageConstructor {
    constructor(variables, pages, document) {
      this.variables = variables;
      this.pages = pages;
      this.document = document;
      this.current_page = 0
    }

    create_listeners() {
        var self = this;
        $(this.document).on("change", "input[type='file']", function() {
            self.variables[this.name]["filename"] = URL.createObjectURL(this.files[0]);
            self.variables[this.name]["path"] = this.files[0];
        })
        $(this.document).on("change", "input[type='text']", function() {
            if (this.name != 'regions') {
                self.variables[this.name] = this.value;
            }
        })
        $(this.document).on("change", "input[type='address']", function() {
            self.variables["address"][this.name] = this.value;
        })
        $(this.document).on("change", "input[type='password']", function() {
            self.variables[this.name] = this.value;
        })
        $(this.document).on("change", "textarea", function() {
            self.variables[this.name] = this.value;
        })
        $(this.document).on("change", "input[type='number']", function() {
            self.variables[this.name] = this.value;
        })
        $(this.document).on("keyup", "input[type='budget']", function() {
            var internationalNumberFormat = new Intl.NumberFormat('en-US')
            self.variables[this.name] = this.value;
            var budget = self.variables[this.name] ? parseInt(self.variables[this.name]) : 0
            var num_visitors = parseInt(budget / 3)
            var num_impressions = parseInt(num_visitors * 33)
            var text = num_visitors ? `Get ${internationalNumberFormat.format(num_visitors)} unique visitors and an estimated ${internationalNumberFormat.format(num_impressions)} impressions` : "Estimated engagement..."
            $('#budget-estimates').text(text);
        })
        $(this.document).on("change", "input[type='checkbox']", function() {
            if (this.checked) {
                self.variables[this.name].push(this.value)
            } else {
                var index = self.variables[this.name].indexOf(this.value)
                self.variables[this.name].splice(index, 1)
            }
        })
        $(this.document).on("change", "select", function() {
            self.variables[this.name] = this.value.toLowerCase();
        })
        $(this.document).on("change", "input[type='date']", function() {
            self.variables[this.name] = this.value
        })
    }

    init_regions() {
        var inputs = this.document.getElementsByClassName('regions');
        if (inputs.length == 0) {
            return;
        }
        var self = this;
        var options = {
            types: ['(cities)'],
           };
        var input = inputs[0];
        var regions_list = this.document.getElementById('regions-list');
        var remove_last_region = this.document.getElementById('remove-last-region');
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener("place_changed", () => {
            regions_list.classList.remove('hidden')
            remove_last_region.classList.remove('hidden')
            const place = autocomplete.getPlace()
            var formatted_address = `"${place.formatted_address}"`
            self.variables.regions.push(formatted_address)
            self.document.getElementById("regions-list").innerHTML =  self.variables.regions.join(' ')
            input.value = ''
        })
        $(this.document).on('click', '#remove-last-region', function() {
            self.variables.regions.splice(-1, 1)
            self.document.getElementById("regions-list").innerHTML =  self.variables.regions.join(' ')
            if (self.variables.regions.length == 0) {
                remove_last_region.classList.add('hidden')
            }
        })
    }

    show(finish_button="Sign Up") {
        var page = this.pages[this.current_page]
        var sections = this.document.getElementById("login-sign-up-inputs-wrapper")
        sections.innerHTML = ``
        for (let section of page) {
            var filled_section = this.create_section(section, this.save_text, this.save_select, this.save_checkbox);
            sections.innerHTML += filled_section;
        }
        if (this.current_page == 0) {
            if (document.getElementById("back-button")) {
                document.getElementById("back-button").hidden = true;
            }
        } else {
            document.getElementById("back-button").hidden = false;
        }
        if (this.current_page == this.pages.length-1) {
            this.document.getElementById("main-action-button-text").innerHTML = finish_button;
        } else {
            this.document.getElementById("main-action-button-text").innerHTML = "Next";
        }
        this.init_regions()
    }

    create_section(section) {
        if (section.type == "select") {
            var select = `
            <div class="login-sign-up-input-row">
            <span class='login-sign-up-input-row-name'>${section.title}${section.required ? "*" : ""}</span><br>
            <span class='input-row-subtitle'>${section.subtitle ? section.subtitle : ""}</span>${section.subtitle ? "<br>" : ""}
            <select name="${section.name}" class="${section.class}">
                <option value="" disabled selected>${section.placeholder}</option>
            `
            for (let val of section.options) {
                var select_toggled = this.variables[section.name] == val.toLowerCase() ? "selected" : "!selected"
                select += `<option value="${val.toLowerCase()}" ${select_toggled}>${val}</option>`
            }
            select += '</select></div>'
            return select
        }
        else if (section.type == "checkbox") {
            var checkbox = `<div class="login-sign-up-input-row">
            <span class='login-sign-up-input-row-name'>${section.title}${section.required ? "*" : ""}</span><br>
            <span class='input-row-subtitle'>${section.subtitle ? section.subtitle : ""}</span>${section.subtitle ? "<br>" : ""}`
            for (let val of section.options) {
                var check_toggled = this.variables[section.name].includes(val.toLowerCase()) ? "checked" : "!checked"
                checkbox += `<div class="sign-up-checkbox">
                <input class="single-checkbox" type="checkbox" name="${section.name}" value="${val.toLowerCase()}" ${check_toggled}>
                <label for="${val.toLowerCase()}"> ${val}</label><br>
                </div>
                `
            }
            checkbox += '</div>'
            return checkbox
        } else if (section.type == "budget") {
            return `
            <div class="login-sign-up-input-row">
                <span class='login-sign-up-input-row-name'>${section.title}${section.required ? "*" : ""}</span><br>
                <span class='input-row-subtitle'>${section.subtitle ? section.subtitle : ""}</span>${section.subtitle ? "<br>" : ""}
                <input class="${section.class}" style="${section.style}" type="${section.type}" name="${section.name}" placeholder="${section.placeholder}" value="${this.variables[section.name]}"/>
                <span class="error-message"></span>
            </div>
            <div id="budget-estimates">Estimated engagement...</div>
            `
        } 
        else if (section.type == "review") {
            var name = section.sub_type == "file" ? this.variables[section.name]["path"].name : this.variables[section.name]
            return `
            <div class="login-sign-up-input-row">
                <span class='campaign-result-title'>${section.title}</span><br>
                ${name}
            </div>
            `
        } else if (section.type=="file"){
            return `
            <div class="login-sign-up-input-row ">
                <span class='login-sign-up-input-row-name'>${section.title}${section.required ? "*" : ""}</span><br>
                <span class='input-row-subtitle'>${section.subtitle ? section.subtitle : ""}</span>${section.subtitle ? "<br>" : ""}
                <input class="${section.class} ${section.class_style}" style="${section.style}" type="${section.type}" name="${section.name}" files="${this.variables[section.name]["path"]}" ${section.meta} accept="image/*"/>
                <span class="error-message"></span>
            </div>
            `
        } else if (section.class_style == "long_text") {
            return `
            <div class="login-sign-up-input-row ">
                <span class='login-sign-up-input-row-name'>${section.title}${section.required ? "*" : ""}</span><br>
                <span class='input-row-subtitle'>${section.subtitle ? section.subtitle : ""}</span>${section.subtitle ? "<br>" : ""}
                <textarea class="${section.class} ${section.class_style}" style="${section.style}" type="${section.type}" name="${section.name}" placeholder="${section.placeholder}" ${section.meta}>${this.variables[section.name]}</textarea>
                <span class="error-message"></span>
            </div>
            `
        } else if (section.class_style == "address") {
            return `
            <div class="login-sign-up-input-row ">
                <span class='login-sign-up-input-row-name'>${section.title}${section.required ? "*" : ""}</span><br>
                <span class='input-row-subtitle'>${section.subtitle ? section.subtitle : ""}</span>${section.subtitle ? "<br>" : ""}
                <input class="${section.class} ${section.class_style}" style="${section.style}" type="${section.type}" name="${section.name}" value="${this.variables["address"][section.name]}" placeholder="${section.placeholder}" ${section.meta}></input>
                <span class="error-message"></span>
            </div>
            `
        } else if (section.class_style == "regions") {
            return `
            <div class="login-sign-up-input-row ">
                <span class='login-sign-up-input-row-name'>${section.title}${section.required ? "*" : ""}</span><br>
                <span class='input-row-subtitle'>${section.subtitle ? section.subtitle : ""}</span>${section.subtitle ? "<br>" : ""}
                <input class="${section.class} ${section.class_style}" style="${section.style}" type="${section.type}" name="${section.name}" placeholder="${section.placeholder}" value="${this.variables[section.name]}" min=${(new Date()).toISOString().split('T')[0]} ${section.meta}/>
                <br>
                <div id="regions-list" class="hidden">${this.variables[section.name]}</div>
                <br>
                <div id="remove-last-region" class="hidden" style='color: #0A47e4'>Undo Last Region</div>
            </div>
            `
        } else {
            return `
            <div class="login-sign-up-input-row ">
                <span class='login-sign-up-input-row-name'>${section.title}${section.required ? "*" : ""}</span><br>
                <span class='input-row-subtitle'>${section.subtitle ? section.subtitle : ""}</span>${section.subtitle ? "<br>" : ""}
                <input class="${section.class} ${section.class_style}" style="${section.style}" type="${section.type}" name="${section.name}" placeholder="${section.placeholder}" value="${this.variables[section.name]}" min=${(new Date()).toISOString().split('T')[0]} ${section.meta}/>
                <span class="error-message"></span>
            </div>
            `
        }
    }
    
    next_page(finish_button="Sign Up") {
        if (this.current_page < this.pages.length-1) {
            this.current_page += 1
            // this will take us to the final page which should have Launch Campaign as the button text
            this.show(finish_button)
        }
    }

    previous_page() {
        if (this.current_page > 0) {
            this.current_page -= 1
            this.show()
        }
    }
}

export {PageConstructor}
