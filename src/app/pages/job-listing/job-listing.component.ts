


import { Component } from '@angular/core';
import { JobService } from 'src/app/service/job.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map,forkJoin , Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./job-listing.component.css']
})
export class JobListingComponent {
  userInfo: any;
  jobList: any[] = [];
  applications: any[] = [];
  isExpanded: boolean = false;

  constructor(private jobSrv: JobService, private router: Router) {
    // Get employerId from localStorage
    const employerId = localStorage.getItem('employerId');
    if (employerId !== null) {
      this.userInfo = { id: employerId }; // Set userInfo with the employerId
      this.getJobsByEmployer();
    }
  }

  // Fetch jobs by employerId
  getJobsByEmployer() {
    this.jobSrv.GetJobsByEmployerId(this.userInfo.id).subscribe((res: any) => {
      this.jobList = res;
    
    });
  }
  



  openJobs(job: any) {
    console.log('Selected Job Object:', job); 
  
    // Collapse all jobs before expanding the selected one
    this.jobList.forEach(element => {
      element.isExpanded = false;
      element.applications = []; // Reset applications for other jobs
    });
    job.isExpanded = true;
  
    // Check if the job `id` exists
    if (!job.id) {
      console.error('Invalid job id:', job.id);
      return; // Exit early if the job id is invalid
    }
  
    // Fetch applications for the selected job using the job's `id`
    this.jobSrv.GetApplicationsByJobId(job.id).subscribe({
      next: (applicationsRes: any[]) => {
        console.log('Applications fetched:', applicationsRes); // Log the fetched applications
  
        // Prepare requests to fetch detailed job seeker information
        const requests = applicationsRes.map(application =>
          this.jobSrv.GetJobSeekerById(application.jobSeekerId).pipe(
            map(jobSeekerRes => ({
              id: application.id, // Application ID
              fullName: jobSeekerRes.fullName, // Job seeker full name
              contactNumber: jobSeekerRes.contactNumber, // Job seeker contact
              education: jobSeekerRes.education, // Job seeker education
              skills: jobSeekerRes.skills, // Job seeker skills
              appliedAt: application.appliedAt, // Application timestamp
              status: application.status, // Application status
            }))
          )
        );
  
        // Fetch all job seeker details in parallel using `forkJoin`
        forkJoin(requests).subscribe({
          next: (applicationDetails: any[]) => {
            job.applications = applicationDetails; // Assign the enriched applications to the specific job
          },
          error: (err) => {
            console.error('Error fetching job seeker details:', err);
            job.applications = []; // Empty the applications array in case of an error
          },
        });
      },
      error: (err) => {
        console.error('Error fetching applications:', err);
        job.applications = []; // Empty the applications array if fetching applications fails
      },
    });
  }
  // Close expanded job panel
  closeJobs(job: any) {
    console.log('Closing Job Panel for:', job.title);
    job.isExpanded = false; // Collapse the current job panel
    job.applications = []; // Optionally clear the applications if desired
  }


  // Delete Job
  // deleteJob(jobId: number) {
  //   if (confirm('Are you sure you want to delete this job?')) {
  //     this.jobSrv.DeleteJob(jobId).subscribe(() => {
  //       alert('Job deleted successfully.');
  //       this.getJobsByEmployer();
  //     });
  //   }
  // }

  deleteJob(jobId: number) {
    if (confirm('Are you sure you want to delete this job?')) {
      // Optimistic UI update: Remove the job immediately from the local job list
      this.jobList = this.jobList.filter(job => job.id !== jobId);
  
      // Call the delete API to remove the job from the backend
      this.jobSrv.DeleteJob(jobId).subscribe({
        next: () => {
          alert('Job deleted successfully.');
          // Optionally refresh the job list
          this.getJobsByEmployer();
        },
        error: (err) => {
          console.error('Error deleting job:', err)
          this.jobList.push(jobId);  // Re-add the job if deletion failed
        
        }
      });
    }
  }

  // Navigate to Update Job Component
  updateJob(jobId: number) {
    this.router.navigate(['/update-job', jobId]);
  }
}