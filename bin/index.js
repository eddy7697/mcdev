#!/usr/bin/env node

const { exec } = require('child_process')
let fs = require('fs')
let path = '/Users/liminghong/dummy'
let list = fs.readdirSync(path)
let Spinner = require('cli-spinner').Spinner;
 
let spinner = new Spinner('正在取得檔案列表.. %s');
spinner.setSpinnerString('|/-\\');
spinner.start();

let getlocalPromise = new Promise((resolve, reject) => {
    let localList = []
    let loaded = 0;

    list.forEach(elm => {
        exec(`gsutil hash -m ${path}/${elm}`, (err, stdout, stderr) => {
            if (err) {
                return
            }

            localList.push(outputParser(stdout))   

            loaded += 1

            console.log(loaded)

            console.log(list.length)
                // resolve()
                console.log(localList)
            
            if (loaded == list.length) {
                resolve(localList)
            } else {
                reject(456)        
            }
        })        
    })
})

getlocalPromise.then(val => {
    console.log(`\n${val}`)
    spinner.stop()
})

// list.forEach(elm => {
//     exec(`gsutil hash -m ${path}/${elm}`, (err, stdout, stderr) => {
//         if (err) {
//             return
//         }

//         outputParser(stdout)
//     })
//     spinner.stop();
// })

// exec(`gsutil ls gs://dummyupload`, (err, stdout, stderr) => {
//     if (err) {
//         return
//     }

//     let gslist = stdout.split(/\r?\n/)

//     gslist.forEach(elm => {

//         // console.log(elm)
//         exec(`gsutil hash -m ${elm}`, (serr, out, sterr) => {
//             if (serr) {
//                 return
//             }
    
//             // console.log(out.replace(/\t/g, '').split(/\r?\n/))
//             // outputParser(out)
//             // console.log(`stderr: ${serr}`)
//         })
//     })

//     // console.log(`stdout: ${stdout}`)
//     // console.log(`stderr: ${stderr}`)
// })

function outputParser(output) {
    let parsed = output.replace(/\t/g, '').split(/\r?\n/)
    let name = parsed[0].replace(/:/g, '').split(' ')[3]
    let md5 = parsed[2].split(':')[1]
    let obj = {
        fileName: name,
        md5: md5
    }

    // console.log(output)
    // console.log(obj)
    return obj
}