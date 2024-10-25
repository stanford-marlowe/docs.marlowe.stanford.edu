$(document).ready(function() {
  generateTips();
  $(document).on('click', '#generateBtn', function() {
    generateTips();
  });
  $(document).on('click', '.copy,.fa-clipboard', function(e) {
    generateTips();
    copyButton(e);
  });

  var savedProjectName = checkSession('projectName');
  if (savedProjectName) {
    autoFillSession('#projectName', savedProjectName);
  }
  var savedVM = checkSession('vmName');
  if (savedVM) {
    autoFillSession('#vmName', savedVM);
  }

  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      //console.log('Text copied to clipboard', text);
      notifyCopy();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  function hasClass(elem, className) {
    return elem.classList.contains(className);
  }

  function generateTips() {
    //set up default values
    var vmName = $('#vmName').val();
    if (!vmName) {
      vmName = '[VM Name]';
    } else {
      saveToSession('vmName', vmName);
    }
    var projectName = $('#projectName').val();
    if (!projectName) {
      projectName = '[Project Name]';
    } else {
      saveToSession('projectName', projectName);
    }
    var powerVM = $('#powerVM');
    if (vmName) {
      powerVM.empty();
      var powerVMCommand = "gcloud compute instances start " + vmName + " --project " + projectName;
      powerVM.val(powerVMCommand);
    }
    var powerUrl = $('#powerUrl');
    powerUrl.empty();
    var powerUrlCommand = "https://console.cloud.google.com/compute/instances?project=" + projectName;
    powerUrl.val(powerUrlCommand);
    if (projectName != '[Project Name]') {
      $('#powerUrlLink').html('<a href="' + powerUrlCommand + '" target="_new">' + powerUrlCommand + '</a>')
    }

    var turnItOff = $('#turnItOff');
    turnItOff.empty();
    var turnItOffCommand = "gcloud compute instances stop " + vmName + " --project " + projectName;
    turnItOff.val(turnItOffCommand);

    var connect = $('#connect');
    connect.empty();
    var connectCommand = "gcloud compute ssh --zone=us-west1-a " + vmName + " --project " + projectName + " -- -L 8080:localhost:8080";
    connect.val(connectCommand);

  }

  //gets data-target attribute of button and copies contents of that element
  function copyButton(event) {
    var node = event.target;
    node = node.closest('.btn.copy');
    $(node).addClass("copy-target");
    var targetText = node.dataset.target;
    var textToCopy = $("#" + targetText);
    var text = textToCopy.val();
    copyTextToClipboard(text);
  }

  function notifyCopy() {
    baseWidth = $('.copy.copy-target').width();
    $('.copy.copy-target').width(baseWidth);
    copyBling();
    setTimeout(function() {
      copyUnBling();
      $('.copy-target').removeClass('copy-target');
    }, 2000); // Delay in milliseconds

  }

  function copyBling() {
    //console.log('copyBling');
    $('.copy.copy-target i').addClass('fa-beat');
    $('.copy.copy-target i').addClass('fa-solid fa-clipboard-check');
    $('.copy.copy-target i').removeClass('fa-regular fa-clipboard');
  }

  function copyUnBling() {
    //console.log('copyUnBling');
    $('.copy.copy-target i').removeClass('fa-beat');
    $('.copy.copy-target i').removeClass('fa-solid fa-clipboard-check');
    $('.copy.copy-target i').addClass('fa-regular fa-clipboard');
  }

  function saveToSession(field, fieldValue) {
    sessionStorage.setItem(field, fieldValue);
  }

  function checkSession(field) {
    var fieldValue = sessionStorage.getItem(field);
    if (fieldValue) {
      return fieldValue;
    }
  }

  function autoFillSession(selector, fieldValue) {
    field = $(selector);
    field.val(fieldValue);
    generateTips();
  }
});