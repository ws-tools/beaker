import * as yo from 'yo-yo'
import { createArchiveFlow } from '../com/modals/edit-site'
import { shortenHash } from '../../lib/strings'
import { archiveFiles, onDragDrop, onClickSelectFiles } from '../com/files-list'

// exported api
// =

export function render (archive, opts = {}) {
  // const rerender = opts.render || (() => {})
  if (opts.viewError) return renderError(opts.viewError)
  if (!archive) return renderEmpty()
  return renderArchive(archive, opts)
}

function renderEmpty () {
  return yo`<div class="archive-view">
    <div class="archive-empty-banner">
      <h2>No site selected.</h2>
      <p>Share files, pages, and applications. <a onclick=${createArchiveFlow}>New site</a>.</p>
    </div>
  </div>`
}

function renderError (error) {
  return yo`<div class="archive">
    <div class="archive-error">
      <div class="archive-error-banner">
        <div class="icon icon-attention"></div>
        <div>The archive failed to load. ${error.toString()}. Sorry for the inconvenience.</div>
      </div>
      <div class="archive-error-narclink">
        <a href="https://github.com/beakerbrowser/beaker/issues" target="_blank">Report Issue</a>
        | 
        <a href="https://groups.google.com/forum/#!forum/beaker-browser" target="_blank">Request Help</a>
      </div>
    </div>
  </div>`
}

function renderArchive (archive, opts) {
  // composite
  return yo`
    <div class="archive-view">
      <div class="archive-header">
        <h2><a href=${'dat://'+archive.info.key} title=${archive.niceName}>${archive.niceName}</a></h2>
        <p class="archive-desc">${rDescription(archive)}<br />${rEditBtn(archive)} ${rForkBtn(archive)} ${rSaveBtn(archive)} ${rHostBn(archive)}</p>
        ${rProvinence(archive)}
      </div>
      ${rSubnav(archive)}
      ${archiveFiles(archive.files.currentNode, {onOpenFolder, archiveKey: archive.key})}
    </div>
  `
}

function onOpenFolder() {/*todo*/}

function rDescription (archive) {
  return (archive.info.description)
    ? yo`<span>${archive.info.description}</span>`
    : yo`<em>no description</em>`
}

function rEditBtn (archive) {
  return yo`<a href="#" style="margin-right: 10px"><span class="icon icon-pencil"></span> Edit</a>`
}

function rForkBtn (archive) {
  return yo`<a href="#" style="margin-right: 10px"><span class="icon icon-flow-branch"></span> Fork</a>`
}

function rSaveBtn (archive) {
  return yo`<a href="#" style="margin-right: 10px"><span class="icon icon-floppy"></span> Save</a>`
}

function rHostBn (archive) {
  return yo`<a href="#" style="margin-right: 10px"><span class="icon icon-upload-cloud"></span> Host</a>`
}

function rProvinence (archive) {
  var infoEls = []
  if (archive.forkOf) infoEls.push(yo`<div><span class="icon icon-flow-branch"></span> Fork of <a href=${archive.forkOf}>${shortenHash(archive.forkOf)}</a></div>`)
  if (archive.info.createdBy) infoEls.push(yo`<div><span class="icon icon-code"></span> Created by <a href=${archive.info.createdBy.url}>${archive.info.createdBy.title || shortenHash(archive.info.createdBy.url)}</a></div>`)
  if (infoEls.length === 0) return ''
  return yo`<p class="archive-provinence">${infoEls}</p>`
}

function rSubnav (archive) {
  return yo`<div class="archive-subnav">
    <a class="active">Files</a>
    <a>History</a>
    <a>Forks</a>
    <a>Hosts</a>
  </div>`
}
