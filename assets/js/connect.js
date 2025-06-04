$(document).ready(function() {
  generateTips();
  var projectId = "";
  var savedprojectId = checkSession('projectId');
  $(document).on('click', '.generate-btn', function() {
    generateTips();
  });
  $(document).on('click', '.clear-btn', function() {
    var oldProjectIdMatch = checkSession('projectId');
    saveToSession('projectId', '');
    autoFillSession('.project-id', '');
    generateTips(oldProjectIdMatch);
  });

  $(document).on('click', '.copy,.fa-clipboard', function(e) {
    generateTips();
    copyButton(e);
  });

  $(document).on('click', '.date', function(e) {
    generateUtilization();
  });

  if (savedprojectId) {
    autoFillSession('#projectId', savedprojectId);
    autoFillSession('#projectId2', savedprojectId);
    projectId = savedprojectId;
  }
  var startDate = getBackDate();
  setStartDate(startDate);
  setEndDate();
  generateUtilization();

  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
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
    var projectId2 = $('#projectId2').val();

    if (!projectId2) {
      $('#projectId2').val(projectId);
    } else {
      if (!projectId) {
        $('#projectId').val(projectId2);
      }
    }

    var srun = $('#srun code');
    var salloc = $('#salloc code');
    var sbatch = $('#sbatch code');
    var utilization = $('#utilization code');
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
    generateUtilization(projectId)
  }

  function generateUtilization(projectId) {
    const utilizationText = $('#utilization code')
    var mediumId = "[ProjectID Medium]"
    if (!projectId) {
      projectId = $('#projectId').val();
    }
    if (projectId) {
      mediumId = "marlowe-" + projectId + "-pm01";
    }
    var startDate = getStartDate();
    var endDate = getEndDate();

    var utilScript = "sreport cluster UserUtilizationByAccount -T gres/gpu Start=" + startDate + " End=" + endDate + " account=" + mediumId + " -t hours"
    utilizationText.html(utilScript);

  }

  function setStartDate(date) {
    const startDateControl = $('#startDate');
    startDateControl.val(date);
  }

  function setEndDate() {
    const endDateControl = $('#endDate');
    var today = getToday();
    endDateControl.val(today);
  }

  //get today
  function getToday() {
    var today = new Date();
    today = today.toISOString().substring(0, 10);
    return today;
  }

  //get a date one month ago
  function getBackDate() {
    var d = new Date();
    var m = d.getMonth();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().substring(0, 10);
  }

  function getEndDate() {
    const endDateControl = $('#endDate');
    var endDate = endDateControl.val();
    if (!endDate) {
      endDate = getToday();
    }
    return endDate;
  }

  function getStartDate() {
    const startDateControl = $('#startDate');
    var startDate = startDateControl.val();
    if (!startDate) {
      startDate = getBackDate();
    }
    return startDate;
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
    $('.copy.copy-target i').addClass('fa-beat');
    $('.copy.copy-target i').addClass('fa-solid fa-clipboard-check');
    $('.copy.copy-target i').removeClass('fa-regular fa-clipboard');
  }

  function copyUnBling() {
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