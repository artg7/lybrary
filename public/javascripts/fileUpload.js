//registering all the filepond plugins used @ layout.ejs file
FilePond.registerPlugin( 
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    )

//configuring filepond settings
FilePond.setOptions ({
    stylePanelAspectRatio: 150 / 100, //to match image dimensions specified @ books/index.ejs (for image preview)
    imageResizeTargetWidth: 100, //same but for stored images
    imageResizeTargetHeight: 150
})

//treating all file inputs from our page as filepond inputs
FilePond.parse(document.body) 