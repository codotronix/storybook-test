(function(){
    // init the version info variable
    let v_info = { 'versions': [] } 

    // Download latest versions info
    fetch('/dist/versions_info.json')
    .then(res => res.json())
    .then(v => {
        v_info = v 
        // dynamically create and load the version select component
        loadVersionSelectComponent()
    })

    function createVSelectHTML() {
        const versionFromURL = window.location.href.split('/dist/')[1].split('/')[0]
        // create version select element html as string
        return `
            <span class="label">Version</span>
            <select>
                ${v_info.versions.reduce((acc, op) =>  acc + `<option 
                                                            value=${op.path}
                                                            ${op.path === versionFromURL ? ' selected' : ''}
                                                        >
                                                            ${op.label}
                                                        </option>`, '')}
            </select>
            <style>
                #sb_version_container .label {
                    font-size: 13px;
                    color: rgb(153, 153, 153);
                    font-weight: bold;
                }
                #sb_version_container select {
                    appearance: none;
                    height: 28px;
                    padding: 0 16px;
                    border: 1px solid rgba(153, 153, 153, 0.4);
                    background: transparent;
                    border-radius: 28px;
                    font-size: 12px;
                    font-family: inherit;
                    transition: all 150ms ease 0s;
                    color: rgb(51, 51, 51);
                    margin-left: 5px;
                }
            </style>
        `
    }

    function loadVersionSelectComponent() {
        // if not already loaded
        if(!document.querySelector('#sb_version_container')) {
            // if .sidebar-header is loaded
            // then load it after that
            if(document.querySelector('.sidebar-header')) {
                const selectHTML = createVSelectHTML()
                const sb_version_container = document.createElement('div')
                sb_version_container.id = "sb_version_container"
                sb_version_container.innerHTML = selectHTML
                document.querySelector('.sidebar-header').after(sb_version_container)

                document.querySelector('#sb_version_container select').addEventListener('change', function(ev){
                    const version = ev.target.value
                    // console.log(version)
                    window.location.href = window.location.origin + '/dist/' + version
                })
            }
        }

        // keep on checking
        // if react rendering removes it, reload it
        setTimeout(loadVersionSelectComponent, 500)
    }
})()