$(document).ready(function() {

  var projectId = "[ProjectID]"

  bindElements();

  //retrieve saved values from session storage
  var savedprojectId = checkSession('projectId');
  if (savedprojectId) {
    autoFillSession('#projectId', savedprojectId);
    autoFillSession('#projectId2', savedprojectId);
  }
  var savedprojectIdSuffix = checkSession('projectIdSuffix');
  if (savedprojectIdSuffix) {
    projectIdSuffix = savedprojectIdSuffix;
    autoFillSession('#projectIdSuffix', savedprojectIdSuffix);
  }

  generateTips(projectId);

  var startDate = getBackDate();
  setStartDate(startDate);
  setEndDate();
  generateUtilization();
  //end startup

  function bindElements() {
    $(document).on('click', '.gen-btn', function() {
      generateTips();
      generateUtilization();
    });

    $(document).on('click', '.clear-btn', function() {
      saveToSession('projectId', '');
      autoFillSession('.project-id', '');
      saveToSession('projectIdSuffix', '');
      autoFillSession('#projectIdSuffix', '');
      projectId = "[ProjectID]"
      generateTips(projectId);
      generateUtilization()
    });

    $(document).on('click', '.copy,.fa-clipboard', function(e) {
      generateTips();
      generateUtilization();
      copyButton(e);
    });

    $(document).on('click', '.date', function(e) {
      generateUtilization();
    });

    $(document).on('blur', '.project-id', function(e) {
      var changed = e.target.id;
      syncProjectID(changed)
      generateUtilization();
      generateTips();
    });
  }

  function syncProjectID(ele) {
    var newValue = $('#' + ele).val();
    //console.log('newValue', ele)
    $('.project-id').val(newValue);
  }

  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      notifyCopy();
    } catch (err) {
      //console.error('Failed to copy: ', err);
    }
  }

  function hasClass(elem, className) {
    return elem.classList.contains(className);
  }

  function generateTips(replacementId) {
    if (replacementId){
      projectId = replacementId;
    }else{
      projectId = $('#projectId').val();
      saveToSession('projectId', projectId);
      generateUtilization(projectId);
    }
    if (projectId) {
      generateSrun(projectId);
      generateSalloc(projectId);
      generateSbatch(projectId);
    }
    
  }

  function generateSrun(projectId) {
    var newStr = "srun -N 1 -G 4 -A marlowe-" + projectId + " -p beta --pty bash"
    replaceText('srun', newStr);
  }

  function generateSalloc(projectId) {
    var newStr = "salloc -N 1 -A marlowe-" + projectId + " -p preempt"
    replaceText('salloc', newStr);
  }

  function generateSbatch(projectId) {
    var newStr = "#!/bin/sh \n" +
      "#SBATCH --job-name=test \n" +
      "#SBATCH -p preempt \n" +
      "#SBATCH --nodes=1 \n" +
      "#SBATCH -A marlowe-" + projectId + "\n" +
      "#SBATCH -G 8 \n" +
      "#SBATCH --time=00:30:00 \n" +
      "#SBATCH --error=~/foo.err \n" +
      "\n" +
      "module load slurm \n" +
      "module load nvhpc \n" +
      "module load cudnn/cuda12/9.3.0.75 \n" +
      "\n" +
      "bash ~/test.sh \n"
    replaceText('sbatch', newStr);
  }

  function replaceText(selector, string) {
    var element = $('#' + selector + ' code');
    element.html(string);
  }

  function generateUtilization(projectId) {
    const utilizationText = $('#utilization code');
    var projectIdSuffix = $('#projectIdSuffix').val();
    if (!projectIdSuffix) {
      projectIdSuffix = "[suffix]"
    }
    var reportId = "[ProjectID with suffix]"
    if (!projectId) {
      projectId = $('#projectId').val();
    }
    if (projectId) {
      reportId = "marlowe-" + projectId + "-" + projectIdSuffix;
    }
    var startDate = getStartDate();
    var endDate = getEndDate();

    var utilScript = "sreport cluster UserUtilizationByAccount -T gres/gpu Start=" + startDate + " End=" + endDate + " account=" + reportId + " -t hours"
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
    document.getElementById("endDate").max = today;
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