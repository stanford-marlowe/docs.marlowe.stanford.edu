$(document).ready(function() {
  generateTips();
  var savedprojectId = checkSession('projectId');
  $(document).on('click', '#generateBtn', function() {
    generateTips();
  });
  $(document).on('click', '#clearBtn', function() {
    var oldProjectIdMatch = checkSession('projectId');
    saveToSession('projectId', '');
    autoFillSession('#projectId', '');
    generateTips(oldProjectIdMatch);
  });

  $(document).on('click', '.copy,.fa-clipboard', function(e) {
    generateTips();
    copyButton(e);
  });

  if (savedprojectId) {
    autoFillSession('#projectId', savedprojectId);
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

  function generateTips(oldProjectIdMatch) {
    //set up default values
    var projectId = $('#projectId').val();
    var matchText = "[Project ID]"
    if (!projectId) {
      projectId = matchText;
    } else {
      saveToSession('projectId', projectId);
    }
    var srun = $('#srun code');
    var salloc = $('#salloc code');
    var sbatch = $('#sbatch code');
    if (oldProjectIdMatch) {
      matchText = oldProjectIdMatch;
    }
    var cleanText = srun.html();
    const newStr = cleanText.replace(matchText, projectId);
    srun.html(newStr);

    if (projectId) {
      var cleanText = salloc.html();
      const newStr = cleanText.replace(matchText, projectId);
      salloc.html(newStr);
    }

    if (projectId) {
      var cleanText = sbatch.html();
      const newStr = cleanText.replace(matchText, projectId);
      sbatch.html(newStr);
    }
  }

  //gets data-target attribute of button and copies contents of that element
  function copyButton(event) {
    var node = event.target;
    node = node.closest('.btn.copy');
    $(node).addClass("copy-target");
    var targetText = node.dataset.target;
    var targetMethod = node.dataset.method;
    var textToCopy = $("#" + targetText);
    var text = "";
    text = textToCopy.text();
    //console.log('text', text);
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