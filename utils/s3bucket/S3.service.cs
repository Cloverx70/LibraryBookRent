using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using MimeKit;

namespace backend.utils.s3bucket
{
    public interface IS3Service
    {
        Task<Res<string>> UploadFileAsync(string filePath, Stream inputStream, string fileName);

        Task<Res<string>> DeleteFileAsyncByURL(string url);
    }

    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _s3BaseUrl;
        private readonly IConfiguration _configuration;

        public S3Service(
            IAmazonS3 s3Client,
            ILogger<S3Service> logger,
            string s3BaseUrl,
            IConfiguration configuration
        )
        {
            _s3BaseUrl = s3BaseUrl;
            _configuration = configuration;

            var accessKey = _configuration["AWS:AccessKey"];
            var secretKey = _configuration["AWS:SecretKey"];
            var region = RegionEndpoint.GetBySystemName(_configuration["AWS:Region"]);

            var credentials = new BasicAWSCredentials(accessKey, secretKey);
            _s3Client = new AmazonS3Client(credentials, region);
        }

        public async Task<Res<string>> UploadFileAsync(
            string filePath,
            Stream inputStream,
            string fileName
        )
        {
            if (inputStream == null || inputStream.Length == 0)
                throw new ArgumentException("Input stream cannot be null or empty.");

            try
            {
                string s3bucketName =
                    _configuration.GetSection("S3BucketSettings")["bucketName"]
                    ?? throw new KeyNotFoundException("bucket name not found");

                string name = $"{filePath}{Guid.NewGuid()}";

                string contentType = MimeTypes.GetMimeType(fileName);

                var fileTransferUtility = new TransferUtility(_s3Client);
                var uploadRequest = new TransferUtilityUploadRequest
                {
                    BucketName = s3bucketName,
                    InputStream = inputStream,
                    Key = name,
                    ContentType = contentType,
                };

                uploadRequest.Metadata.Add("Content-Disposition", "inline");

                await fileTransferUtility.UploadAsync(uploadRequest);

                string fileUrl = $"{_s3BaseUrl}/{name}";
                return new Res<string>(200, "File uploaded successfully", fileUrl);
            }
            catch (Exception ex)
                when (ex is AmazonS3Exception
                    || ex is KeyNotFoundException
                    || ex is ArgumentException
                )
            {
                if (ex is AmazonS3Exception)
                    throw new AmazonS3Exception(
                        ex.Message ?? "An error occurred while uploading the file to S3."
                    );
                if (ex is KeyNotFoundException)
                    throw new KeyNotFoundException(ex.Message);

                if (ex is ArgumentException)
                    throw new ArgumentException(ex.Message);
                throw new Exception(ex.Message);
            }
        }

        public async Task<Res<string>> DeleteFileAsyncByURL(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("URL cannot be null or empty.");

            try
            {
                string s3bucketName =
                    _configuration.GetSection("S3BucketSettings")["bucketName"]
                    ?? throw new KeyNotFoundException("bucket name not found");

                string keyName = url.Replace(_s3BaseUrl + "/", "");

                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = s3bucketName,
                    Key = keyName,
                };

                await _s3Client.DeleteObjectAsync(deleteRequest);
                return new Res<string>(200, "Successfully deleted file");
            }
            catch (Exception ex)
                when (ex is AmazonS3Exception
                    || ex is KeyNotFoundException
                    || ex is ArgumentException
                )
            {
                if (ex is AmazonS3Exception)
                    throw new AmazonS3Exception(
                        ex.Message ?? "An error occurred while uploading the file to S3."
                    );
                if (ex is KeyNotFoundException)
                    throw new KeyNotFoundException(ex.Message);

                if (ex is ArgumentException)
                    throw new ArgumentException(ex.Message);
                throw new Exception(ex.Message);
            }
        }
    }
}
