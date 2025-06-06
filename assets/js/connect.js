$(document).ready(function() {

  var projectId = "[Project ID]"
  var reportId = "[Project ID with Suffix]"
  var projectIdSuffix = "[Suffix]"
  var projectPartition = "[Partition]"

  generateUtilization(reportId);
  $('suffixDiv').show();

  bindElements();

  //retrieve saved values from session storage
  var savedprojectId = checkSession('projectId');
  if (savedprojectId) {
    autoFillSession('#projectId', savedprojectId);
  }
  var savedprojectIdSuffix = checkSession('projectIdSuffix');
  if (savedprojectIdSuffix) {
    projectIdSuffix = savedprojectIdSuffix;
    autoFillSession('#projectIdSuffix', savedprojectIdSuffix);
  }
  var savedprojectPartition = checkSession('projectPartition');
  if (savedprojectPartition && savedprojectPartition != "null") {
    projectPartition = savedprojectPartition;
    autoFillSession('#projectPartition', savedprojectPartition);
    hideSuffix(projectPartition);
  }

  var startDate = getBackDate();
  setStartDate(startDate);
  setEndDate();
  generateTips(projectId);
  //end startup

  function bindElements() {
    $(document).on('click', '.gen-btn', function() {
      generateTips();
    });

    $(document).on('click', '.clear-btn', function() {
      saveToSession('projectId', '');
      autoFillSession('.project-id', '');
      saveToSession('projectIdSuffix', '');
      autoFillSession('#projectIdSuffix', '');
      saveToSession('projectPartition', '');
      autoFillSession('#projectPartition', '');
      projectId = "[Project ID]"
      reportId = "[Project ID with suffix]"
      projectIdSuffix = "[Suffix]"
      projectPartition = "[Partition]"
      generateTips(projectId, projectIdSuffix);
      generateUtilization(reportId)
      hideSuffix()
    });

    $(document).on('click', '.copy,.fa-clipboard', function(e) {
      generateTips();
      copyButton(e);
    });

    $(document).on('click', '.date', function(e) {
      generateTips();
    });

    $(document).on('blur', '#projectId, #projectIdSuffix', function(e) {
      generateTips();
    });
    $(document).on('change', '#projectPartition', function(e) {
      var partition = getPartition();
      hideSuffix(partition);
      generateTips();
    });
  }

  function hideSuffix(partition) {
    if (!partition) {
      partition = getPartition();
    }
    if (partition == 'preempt') {
      $('#suffixDiv').hide();
    } else {
      $('#suffixDiv').show();
    }
  }

  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      notifyCopy();
    } catch (err) {
      //console.error('Failed to copy: ', err);
    }
  }

  function generateTips(replacementId, replacementSuffixId) {
    if (replacementId) {
      projectId = replacementId;
      projectIdSuffix = replacementSuffixId;
    } else {
      projectId = $('#projectId').val();
      saveToSession('projectId', projectId);
      projectIdSuffix = $('#projectIdSuffix').val();
      saveToSession('projectIdSuffix', projectIdSuffix);
      projectPartition = $('#projectPartition').val();
      saveToSession('projectPartition', projectPartition);
    }
    reportId = getReportId(projectId, projectIdSuffix, projectPartition);

    if (reportId) {
      generateSrun(reportId, projectPartition);
      generateSalloc(reportId, projectPartition);
      generateSbatch(reportId, projectPartition);
      generateUtilization(reportId);
    }

  }

  function getReportId(projectId, projectIdSuffix, projectPartition) {

    var noSuffix = false;
    if (projectPartition == "preempt") {
      noSuffix = true;
    }
    if (!projectId) {
      projectId = "[Project ID]";
    }
    if (!projectIdSuffix) {
      projectIdSuffix = "[Suffix]";
    }
    if (noSuffix)
      reportId = projectId;
    else {
      reportId = projectId + "-" + projectIdSuffix;
    }
    return reportId;
  }

  function generateSrun(projectId, projectPartition) {
    var newStr = "srun -N 1 -G 4 -A marlowe-" + projectId + " -p " + projectPartition + " --pty bash"
    replaceText('srun', newStr);
  }

  function generateSalloc(projectId, projectPartition) {
    var newStr = "salloc -N 1 -A marlowe-" + projectId + " -p " + projectPartition
    replaceText('salloc', newStr);
  }

  function generateSbatch(projectId, projectPartition) {
    var newStr = "#!/bin/sh \n" +
      "#SBATCH --job-name=test \n" +
      "#SBATCH -p " + projectPartition + " \n" +
      "#SBATCH --nodes=1 \n" +
      "#SBATCH -A marlowe-" + projectId + " \n" +
      "#SBATCH -G 1 \n" +
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

//runs from inside generateTips
  function generateUtilization(reportId) {
    var startDate = getStartDate();
    var endDate = getEndDate();

    var utilScript = "sreport cluster UserUtilizationByAccount -T gres/gpu Start=" + startDate + " End=" + endDate + " account=marlowe-" + reportId + " -t hours";
    replaceText('utilization', utilScript);
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

  function getPartition() {
    const partitionControl = $('#projectPartition');
    var partition = partitionControl.val();
    return partition;
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